import {getPropByPath, mergeOptions, compose, parseWidth} from './util';
function defaultRenderCell(h, {row, column, $index}) {
    const property = column.property;
    const value = property && getPropByPath(row, property).v;
    if (column && column.formatter) {
        return column.formatter(row, column, value, $index);
    }
    return value;
}

let columnIdSeed = 0;
export default {
    name: 'YmaTableColumn',
    props: {
        label: String,
        prop: String,
        width: String,
        align: String,
        fixed: [Boolean, String],
    },
    data() {
        return {
            columns: [],
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
        columnOrTableParent() {
            let parent = this.$parent;
            while (parent && !parent.tableId && !parent.columnId) {
                parent = parent.$parent;
            }
            return parent;
        },
        realWidth() {
            return parseWidth(this.width);
        },
        realAlign() {
            return this.align ? 'is-' + this.align : null;
        },
    },
    beforeCreate() {
        this.row = {};
        this.column = {};
        this.$index = 0;
        this.columnId = '';
    },
    created() {
        const parent = this.columnOrTableParent;
        this.columnId = (parent.tableId || parent.columnId) + '_column_' + columnIdSeed++;

        const defaults = {
            id: this.columnId,
            index: this.index,
            property: this.prop,
            align: this.realAlign,
        };

        const basicProps = ['label', 'className', 'fixed'];

        let column = this.getPropsData(basicProps);
        column = mergeOptions(defaults, column);

        const chain = compose(this.setColumnRenders, this.setColumnWidth);
        column = chain(column);

        this.columnConfig = column;
    },
    mounted() {
        const owner = this.owner;
        const parent = this.columnOrTableParent;
        const children = parent.$refs.hiddenColumns.children;

        const columnIndex = this.getColumnElIndex(children, this.$el);

        owner.store.commit('insertColumn', this.columnConfig, columnIndex);
    },
    methods: {
        getPropsData(...props) {
            return props.reduce((prev, cur) => {
                if (Array.isArray(cur)) {
                    cur.forEach(key => {
                        prev[key] = this[key];
                    });
                }

                return prev;
            }, {});
        },
        getColumnElIndex(children, child) {
            return [].indexOf.call(children, child);
        },
        setColumnWidth(column) {
            if (this.realWidth) {
                column.width = this.realWidth;
            }

            column.realWidth = column.width === undefined ? 'auto' : column.width;

            return column;
        },
        setColumnRenders(column) {
            column.renderHeader = (h, scope) => {
                const renderHeader = this.$scopedSlots.header;
                return renderHeader ? renderHeader(scope) : column.label;
            };

            const that = this;
            let originRenderCell = column.renderCell || defaultRenderCell;
            column.renderCell = (h, data) => {
                let children = null;

                if (that.$scopedSlots.default) {
                    children = that.$scopedSlots.default(data);
                } else {
                    children = originRenderCell(h, data);
                }

                const props = {
                    class: 'yma-table__cell',
                    style: {},
                };

                return <div {...props}>{children}</div>;
            };

            return column;
        },
    },
    render(h) {
        return h('div', this.$slots.default);
    },
};
