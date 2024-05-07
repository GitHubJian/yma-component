import './main.scss';
import Table from './table';
import TableColumn from './table-column';

Table.install = function (Vue) {
    Vue.component(Table.name, Table);
    Vue.component(TableColumn.name, TableColumn);
};

export default Table;
