import getScrollbarWidth from '../helper/scrollbar';

class TableLayout {
    constructor(options) {
        this.table = null;
        this.store = null;
        this.columns = null;

        this.height = null;
        this.bodyWidth = null;
        this.fixedWidth = null;
        this.tableHeight = null;
        this.headerHeight = 44;
        this.bodyHeight = null;
        this.gutterWidth = getScrollbarWidth();

        for (let name in options) {
            if (options.hasOwnProperty(name)) {
                this[name] = options[name];
            }
        }
    }

    getFlattenColumns() {
        const flattenColumns = [];
        const columns = this.table.columns;
        columns.forEach(column => {
            flattenColumns.push(column);
        });

        return flattenColumns;
    }

    updateColumnsWidth() {
        const bodyWidth = this.table.$el.clientWidth;
        let bodyMinWidth = 0;

        const flattenColumns = this.getFlattenColumns();
        let flexColumns = flattenColumns.filter(column => column.width === null);

        flattenColumns.forEach(column => {
            if (typeof column.width === 'number' && column.realWidth) {
                column.realWidth = null;
            }
        });

        if (flexColumns.length > 0) {
            flattenColumns.forEach(column => {
                bodyMinWidth += column.width || column.minWidth || 80;
            });

            const scrollYWidth = this.scrollY ? this.gutterWidth : 0;
        }
    }
}
