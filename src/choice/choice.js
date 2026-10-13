import YmaIcon from '../icon';
import clickoutside from '../helper/clickoutside';
import emitter from '../helper/emitter';
import popup from '../helper/popup';
import {createStore} from './store';
import YmaScroll from '../scroll';

let choiceIdSeed = 0;
export default {
    name: 'YmaChoice',
    componentName: 'YmaChoice',
    mixins: [emitter, popup],
    directives: {clickoutside},
    provide() {
        return {
            choice: this,
        };
    },
    components: {
        YmaIcon,
        YmaScroll,
    },
    props: {
        defaultActive: {
            type: String,
            required: true,
        },
        trigger: {
            type: String,
            default: 'hover',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        const store = createStore(this);

        return {
            store,
            visible: false,
            triggerEl: null,
            choiceEl: null,
            active: null,
            label: null,
        };
    },
    created() {
        this.choiceId = 'yma-choice_' + choiceIdSeed++;
    },
    mounted() {
        this.store.updateList();

        this.$ready = true;

        this.initDomOperation();

        const item = this.store.states.list.find(item => item.id === this.defaultActive);

        if (item) {
            this.label = item.label;
        }
    },
    watch: {
        defaultActive(val) {
            const item = this.store.states.list.find(item => item.id === this.defaultActive);

            if (item) {
                this.label = item.label;
            }
        },
        'store.states.list'(val) {
            const item = this.store.states.list.find(item => item.id === this.defaultActive);

            if (item) {
                this.label = item.label;
            }
        },
    },
    methods: {
        initEvent() {
            this.triggerEl = this.$refs.triggerEl;
            this.bindPopup(this.triggerEl, this.choiceEl);
        },
        handleItemClick(id) {
            const list = this.store.states.list;
            const item = list.find(item => item.id === id);

            this.label = item.label;

            this.$emit('change', id, item);
        },
        initDomOperation() {
            this.choiceEl = this.popperEl = this.$refs.popperEl;

            this.initEvent();
        },
    },
    render() {
        const {$slots, visible, label, store, handleItemClick, disabled} = this;
        const list = store.states.list;

        return (
            <div
                class={{
                    'yma-choice': true,
                    'is-disabled': disabled,
                }}
                v-clickoutside={this.hide}
            >
                <div class='yma-choice__hidden'>{$slots.default}</div>
                <div
                    ref='triggerEl'
                    class={{
                        'yma-choice-trigger': true,
                        'is-active': visible,
                    }}
                >
                    <span class='yma-choice-trigger__label yma-text-truncate' title={label}>
                        {label}
                    </span>

                    {disabled ? null : <yma-icon class='yma-choice-trigger__icon' name='arrow_triangle_down' />}
                </div>

                {disabled ? null : (
                    <div ref='popperEl' class='yma-choice-menu' style={{display: visible ? 'block' : 'none'}}>
                        <yma-scroll>
                            <ul>
                                {list.map(function (item) {
                                    const {id, label} = item;

                                    return (
                                        <li
                                            key={id}
                                            class={{
                                                'yma-choice-menu__item': true,
                                            }}
                                            on-click={() => handleItemClick(id)}
                                        >
                                            <span class='yma-choice-menu__item-label yma-text-truncate' title={label}>
                                                {label}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </yma-scroll>
                    </div>
                )}
            </div>
        );
    },
};
