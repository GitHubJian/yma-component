import YmaTableAppend from './table-append';

export default {
    name: 'YmaTableRow',
    componentName: 'YmaTableRow',
    props: [
        'columns',
        'row',
        'index',
        'store',
        'getTdClass',
        'draggable',
        'addible',
        'appendHandler',
        'isSelected',
        'selectable',
    ],
    data() {
        return {
            isActive: false,
        };
    },
    computed: {
        owner() {
            let parent = this.$parent;
            while (parent && !parent.tableId) {
                parent = parent.$parent;
            }
            return parent;
        },
    },
    created() {
        this.$on('passive', $index => {
            if (this.index !== $index) {
                this.isActive = false;
            }
        });
    },
    render(h) {
        const {
            columns,
            row,
            index: $index,
            draggable,
            addible,
            store,
            isSelected,
            isActive,
        } = this;

        return (
            <div
                ref='tr'
                class={{
                    'yma-table__tr': true,
                    'is-draggable': draggable,
                    'yma-dragsort__item': draggable,
                    'is-active': isActive,
                }}
                on-click={() => this.selectHandler(row, $index)}>
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
                            style={tdStyle}>
                            {column.renderCell.call(
                                null,
                                this.$createElement,
                                data
                            )}
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
    methods: {
        selectHandler(row, $index) {
            if (this.selectable) {
                const owner = this.owner;

                this.isActive = !this.isActive;

                owner.handleRowSelect(this.isActive, row, $index);
            }
        },
    },
};
