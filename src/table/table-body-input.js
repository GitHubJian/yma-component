import {mapStates} from './store';
import getScrollbarWidth from '../helper/scrollbar';
import YmaLink from '../link';

export default {
    name: 'YmaTableBodyInput',
    components: {
        YmaLink,
    },
    props: ['store', 'trStyle', 'submitHandler', 'cancelHandler'],
    data() {
        return {
            padWidth: getScrollbarWidth(),
            inputs: [],
        };
    },
    computed: {
        table() {
            return this.$parent;
        },
        ...mapStates({
            columns: 'columns',
            isScroll: 'isScroll',
        }),
    },
    methods: {
        handleSubmit() {
            const {columns, inputs} = this;

            const data = columns.reduce((prev, cur, i) => {
                if (cur.property) {
                    prev[cur.property] = inputs[i];
                }

                return prev;
            }, {});

            this.inputs = [];

            this.submitHandler(data);
        },
        handleCancel() {
            this.inputs = [];

            this.cancelHandler();
        },
        focus() {
            if (Array.isArray(this.$refs.input)) {
                this.$refs.input[0].focus();
            } else {
                this.$refs.input.focus();
            }
        },
    },
    render(h) {
        const {columns, isScroll, padWidth, trStyle, inputs, handleSubmit, handleCancel} = this;
        const len = columns.length;

        return (
            <div class={'yma-table__tbody yma-table__tbody-input'}>
                <div class={'yma-table__tbody-input-mask'} on-click={handleCancel}></div>
                <div class={'yma-table__tr'} style={trStyle}>
                    {columns.map((column, i) => {
                        const tdStyle = {};
                        if (column.width) {
                            tdStyle.width = column.width + 'px';
                            tdStyle.flex = 'none';
                        }

                        const template =
                            i === len - 1 ? (
                                <div class={'yma-table__td'}>
                                    <div class={'yma-table__cell'}>
                                        <span class='yma-table__tbody-input-fill'></span>
                                        <yma-link on-click={handleSubmit}>确定</yma-link>
                                        <yma-link on-click={handleCancel} type='danger'>
                                            删除
                                        </yma-link>
                                    </div>
                                </div>
                            ) : (
                                <div class={'yma-table__td'} style={tdStyle}>
                                    <div class={'yma-table__cell'}>
                                        {['selection', 'index'].indexOf(column.type) > -1 ? null : (
                                            <input
                                                ref='input'
                                                class={'yma-table__tbody-input-inner'}
                                                value={inputs[i]}
                                                type='text'
                                                on-change={e => {
                                                    inputs[i] = e.target.value;
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                            );

                        return template;
                    })}

                    {isScroll ? (
                        <div
                            class='yma-table__td is-pad'
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
        );
    },
};
