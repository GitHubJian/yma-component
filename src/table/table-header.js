import {mapStates} from './store';
import getScrollbarWidth from '../helper/scrollbar';

export default {
    name: 'YmaTableHeader',
    props: {
        store: {
            required: true,
        },
        fixed: Boolean,
    },
    data() {
        return {
            padWidth: getScrollbarWidth(),
            isScroll: false,
        };
    },
    computed: {
        table() {
            return this.$parent;
        },

        ...mapStates({
            columns: 'columns',
        }),
    },
    watch: {
        'store.states.isScroll'(newVal) {
            this.$nextTick(() => {
                this.isScroll = newVal;
            });
        },
    },
    mounted() {
        const header = this.$refs.header;
        const rect = header.getBoundingClientRect();

        this.store.commit('setHeaderHeight', rect.height);
    },
    methods: {
        getCellClass(column) {
            const classes = [];

            classes.push(column.align);

            return classes.join(' ');
        },
    },
    render(h) {
        const {columns, fixed, padWidth, isScroll} = this;

        return (
            <div ref='header' class='yma-table__header'>
                <div class='yma-table__thead'>
                    <div class='yma-table__tr'>
                        {columns.map((column, cellIndex) => {
                            return (
                                <div class={['yma-table__th', this.getCellClass(column)]} key={'td_' + cellIndex}>
                                    <div class='yma-table__cell'>
                                        {column.renderHeader
                                            ? column.renderHeader.call(this._renderProxy, h, {
                                                  column,
                                                  $index: cellIndex,
                                                  store: this.store,
                                                  _self: this.$parent.$vnode.context,
                                              })
                                            : column.label}
                                    </div>
                                </div>
                            );
                        })}

                        {fixed && isScroll ? (
                            <div
                                class='yma-table__th is-pad'
                                style={{
                                    width: padWidth + 'px',
                                    flex: 'none',
                                }}
                            >
                                <div class='yma-table__cell'></div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        );
    },
};
