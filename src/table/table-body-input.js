import {mapStates} from './store';
import getScrollbarWidth from '../helper/scrollbar';

export default {
    name: 'YmaTableBodyInput',
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

            this.closeHandler();
        },
    },
    render(h) {
        const {columns, isScroll, padWidth, trStyle, inputs, handleSubmit, handleCancel} = this;
        const len = columns.length;

        return (
            <div class={'yma-table__tbody yma-table__tbody-input'}>
                <div class={'yma-table__tbody-input-mask'} on-click={handleCancel}></div>
                <div class={'yma-table__tr'} style={trStyle}>
                    {columns.map((_, i) => {
                        const template =
                            i === len - 1 ? (
                                <div class={'yma-table__td'}>
                                    <div class={'yma-table__cell'}>
                                        <span on-click={handleSubmit}>确定</span>
                                        <span on-click={handleCancel}>删除</span>
                                    </div>
                                </div>
                            ) : (
                                <div class={'yma-table__td'}>
                                    <div class={'yma-table__cell'}>
                                        <input
                                            value={inputs[i]}
                                            type='text'
                                            on-change={e => {
                                                inputs[i] = e.target.value;
                                            }}
                                        ></input>
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
