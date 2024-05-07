import YmaTableAppend from './table-append';

export default {
    name: 'YmaTableRow',
    props: [
        'columns',
        'row',
        'index',
        'store',
        'getTdClass',
        'draggable',
        'appendHandler',
    ],
    render(h) {
        const {columns, row, index: $index, draggable} = this;

        return (
            <div
                ref='tr'
                class={{
                    'yma-table__tr': true,
                    'is-draggable': draggable,
                    'yma-dragsort__item': draggable,
                }}>
                {columns.map(column => {
                    const columnData = {...column};

                    const data = {
                        column: columnData,
                        row,
                        $index,
                    };

                    return (
                        <div class={['yma-table__td', this.getTdClass(column)]}>
                            {column.renderCell.call(
                                null,
                                this.$createElement,
                                data
                            )}
                        </div>
                    );
                })}

                <YmaTableAppend
                    appendHandler={() => {
                        this.appendHandler(this.$refs.tr, $index);
                    }}
                />
            </div>
        );
    },
};
