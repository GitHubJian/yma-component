import YmaTableAppend from './table-append';

export default {
    name: 'YmaTableRow',
    props: ['columns', 'row', 'index', 'store', 'getTdClass', 'draggable', 'addible', 'appendHandler', 'isSelected'],
    render(h) {
        const {columns, row, index: $index, draggable, addible, store, isSelected} = this;

        return (
            <div
                ref='tr'
                class={{
                    'yma-table__tr': true,
                    'is-draggable': draggable,
                    'yma-dragsort__item': draggable,
                }}
            >
                {columns.map(column => {
                    const columnData = {...column};

                    const tdStyle = {};
                    if (column.width) {
                        tdStyle.width = column.width + 'px';
                        tdStyle.flex = 'none';
                    }

                    let isSelection = column.type === 'selection';

                    const data = {
                        store,
                        isSelected,
                        column: columnData,
                        row,
                        $index,
                    };

                    return (
                        <div
                            class={[
                                'yma-table__td',
                                this.getTdClass(column),
                                {
                                    'is-selection': isSelection,
                                },
                            ]}
                            style={tdStyle}
                        >
                            {column.renderCell.call(null, this.$createElement, data)}
                        </div>
                    );
                })}

                {addible ? (
                    <YmaTableAppend
                        appendHandler={() => {
                            this.appendHandler(this.$refs.tr, $index);
                        }}
                    />
                ) : null}
            </div>
        );
    },
};
