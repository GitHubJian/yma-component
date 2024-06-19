import {mapStates} from './store';
import TableRow from './table-row';
import mousesort from './mixin/mouse';
import {createElement, insertAfter, getRowIdentity} from './util';
import TableBodyInput from './table-body-input';
import {removeChild} from './mixin/mouse/dom';

function sort(newIndex, oldIndex, list) {
    let data = list[oldIndex];

    list.splice(oldIndex, 1);
    list.splice(newIndex, 0, data);

    return list;
}

export default {
    name: 'YmaTableBody',
    props: {
        store: {
            required: true,
        },
        rowClassName: [String, Function],

        draggable: Boolean,
        addible: Boolean,
        selectable: Boolean,
    },
    data() {
        return {
            isShowInput: false,
            top: 0,
            insertDataIndex: 0,
            phEl: null,
        };
    },
    watch: {
        'store.states.data': {
            handler() {
                this.$nextTick(() => {
                    const body = this.$refs.body;
                    const tbody = this.$refs.tbody;

                    const bodyRect = body.getBoundingClientRect();
                    const tbodyRect = tbody.getBoundingClientRect();

                    this.store.commit('needScroll', bodyRect.height < tbodyRect.height);
                });
            },
            deep: true,
        },
    },
    computed: {
        table() {
            return this.$parent;
        },
        ...mapStates({
            data: 'data',
            columns: 'columns',
            headerHeight: 'headerHeight',
        }),
    },
    methods: {
        getKeyOfRow(row, index) {
            const rowKey = this.table.rowKey;
            if (rowKey) {
                return getRowIdentity(row, rowKey);
            }
            return index;
        },
        getRowClass(row, rowIndex) {
            const classes = ['yma-table__tr'];
            const rowClassName = this.table.rowClassName;
            if (typeof rowClassName === 'string') {
                classes.push(rowClassName);
            } else if (typeof rowClassName === 'function') {
                classes.push(
                    rowClassName.call(null, {
                        row,
                        rowIndex,
                    }),
                );
            }

            return classes;
        },
        getCellClass(rowIndex, columnIndex, row, column) {
            const classes = [column.id, column.align, column.className];

            classes.push('yma-tabel__cell');

            return classes.join(' ');
        },
        rowRender(row, $index) {
            const {columns, draggable, addible} = this;
            const rowClasses = this.getRowClass(row, $index);

            return (
                <TableRow
                    class={rowClasses}
                    columns={columns}
                    row={row}
                    index={$index}
                    store={this.store}
                    getCellClass={this.getCellClass}
                    draggable={draggable}
                    addible={addible}
                    appendHandler={this.appendHandler}
                    isSelected={this.store.isSelected(row)}
                    selectable={this.selectable}
                />
            );
        },
        updateData(newIndex, oldIndex) {
            this.$nextTick(() => {
                const store = this.table.store;
                let data = store.states.data;

                this.store.commit('setData', sort(newIndex, oldIndex, data));
            });
        },
        insertData(i, d) {
            this.cancelHandler();

            this.$nextTick(() => {
                const store = this.table.store;
                let data = store.states.data;

                data.splice(i + 1, 0, d);
                this.store.commit('setData', data);
            });
        },
        appendHandler(refNode, index) {
            const body = this.$refs.body;
            const tbody = this.$refs.tbody;
            const phEl = (this.phEl = createElement({
                attrs: {
                    class: 'yma-table__tr',
                },
            }));

            insertAfter(tbody, phEl, refNode);

            this.$nextTick(() => {
                this.isShowInput = true;
                this.insertDataIndex = index;
                const scrollTop = body.scrollTop;
                const tbodyRect = tbody.getBoundingClientRect();
                const refNodeRect = refNode.getBoundingClientRect();

                this.top = parseInt(
                    this.headerHeight + refNodeRect.top + refNodeRect.height - tbodyRect.top - scrollTop,
                );

                this.$nextTick(() => {
                    this.$refs.tableBodyInput.focus();
                });
            });
        },
        cancelHandler() {
            this.top = 0;
            this.isShowInput = false;
            this.insertDataIndex = 0;
            removeChild(this.phEl.parentNode, this.phEl);
        },
    },
    render(h) {
        const data = this.data || [];
        const {draggable, store, isShowInput, top} = this;

        return (
            <div ref='body' class='yma-table__body'>
                <div
                    ref='tbody'
                    class={{
                        'yma-table__tbody': true,
                        'yma-dragsort': draggable,
                    }}
                >
                    {data.map((row, index) => {
                        return this.rowRender(row, index);
                    })}
                </div>

                <TableBodyInput
                    ref='tableBodyInput'
                    store={store}
                    style={{
                        display: !isShowInput ? 'none' : 'block',
                    }}
                    trStyle={{
                        position: 'absolute',
                        top: top + 'px',
                        left: 0,
                        width: '100%',
                    }}
                    cancelHandler={() => {
                        this.cancelHandler();
                    }}
                    submitHandler={d => {
                        this.insertData(this.insertDataIndex, d);
                    }}
                />
            </div>
        );
    },
    mounted() {
        const that = this;
        mousesort(this.$refs.tbody, {
            complete: function (newIndex, oldIndex) {
                that.updateData(newIndex, oldIndex);
            },
        });
    },
};
