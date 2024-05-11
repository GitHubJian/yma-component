import Vue from 'vue';
import {toggleRowStatus} from './util';
function debounce(callback, delay) {
    let timerId;

    return function () {
        clearTimeout(timerId);
        timerId = setTimeout(callback, delay);
    };
}

const Store = Vue.extend({
    data() {
        return {
            states: {
                data: [],

                _columns: [],
                columns: [],
                fixedColumns: [],
                rightFixedColumns: [],
                leafColumns: [],
                fixedLeafColumns: [],
                rightFixedLeafColumns: [],
                leafColumnsLength: 0,
                fixedLeafColumnsLength: 0,
                rightFixedLeafColumnsLength: 0,

                isScroll: false,

                headerHeight: 0,

                isAllSelected: false,
                selection: [],
            },
        };
    },
    methods: {
        updateColumns() {
            const states = this.states;
            const _columns = states._columns || [];

            states.columns = _columns;
            // states.fixedColumns = _columns.filter(
            //     column => column.fixed === true || column.fixed === 'left'
            // );
            // states.rightFixedColumns = _columns.filter(
            //     column => column.fixed === 'right'
            // );
            // const notFixedColumns = _columns.filter(column => !column.fixed);
            // states.originColumns = []
            //     .concat(states.fixedColumns)
            //     .concat(notFixedColumns)
            //     .concat(states.rightFixedColumns);

            // const leafColumns = notFixedColumns;
            // const fixedLeafColumns = states.fixedColumns;
            // const rightFixedLeafColumns = states.rightFixedColumns;

            // states.leafColumnsLength = leafColumns.length;
            // states.fixedLeafColumnsLength = fixedLeafColumns.length;
            // states.rightFixedLeafColumnsLength = rightFixedLeafColumns.length;

            // states.columns = []
            //     .concat(fixedLeafColumns)
            //     .concat(leafColumns)
            //     .concat(rightFixedLeafColumns);
        },
        // 选择
        isSelected(row) {
            const {selection = []} = this.states;
            return selection.indexOf(row) > -1;
        },
        toggleRowSelection(row, selected, emitChange = true) {
            const changed = toggleRowStatus(this.states.selection, row, selected);
            if (changed) {
                const newSelection = (this.states.selection || []).slice();
                // 调用 API 修改选中值，不触发 select 事件
                if (emitChange) {
                    this.table.$emit('select', newSelection, row);
                }

                this.table.$emit('selection-change', newSelection);
            }
        },
        _toggleAllSelection() {
            const states = this.states;
            const {data = [], selection} = states;
            const value = !(states.isAllSelected || selection.length);
            states.isAllSelected = value;

            let selectionChanged = false;
            data.forEach((row, index) => {
                if (states.selectable) {
                    if (states.selectable.call(null, row, index) && toggleRowStatus(selection, row, value)) {
                        selectionChanged = true;
                    }
                } else {
                    if (toggleRowStatus(selection, row, value)) {
                        selectionChanged = true;
                    }
                }
            });

            if (selectionChanged) {
                this.table.$emit('selection-change', selection ? selection.slice() : []);
            }

            this.table.$emit('select-all', selection);
        },
        updateAllSelected() {
            const states = this.states;
            const {selection, rowKey, selectable} = states;
            // data 为 null 时，解构时的默认值会被忽略
            const data = states.data || [];
            if (data.length === 0) {
                states.isAllSelected = false;
                return;
            }

            let selectedMap;
            if (rowKey) {
                selectedMap = getKeysMap(selection, rowKey);
            }
            const isSelected = function (row) {
                if (selectedMap) {
                    return !!selectedMap[getRowIdentity(row, rowKey)];
                }
                return selection.indexOf(row) !== -1;
            };
            let isAllSelected = true;
            let selectedCount = 0;
            for (let i = 0, j = data.length; i < j; i++) {
                const item = data[i];
                const isRowSelectable = selectable && selectable.call(null, item, i);
                if (!isSelected(item)) {
                    if (!selectable || isRowSelectable) {
                        isAllSelected = false;
                        break;
                    }
                } else {
                    selectedCount++;
                }
            }

            if (selectedCount === 0) {
                isAllSelected = false;
            }
            states.isAllSelected = isAllSelected;
        },
    },
});

Store.prototype.mutations = {
    setData(states, data) {
        //
        states._data = data;
        //
        states.data = data;
    },
    insertColumn(states, column, index, parent) {
        let array = states._columns;
        if (parent) {
            array = parent.children;

            if (!array) {
                array = parent.children = [];
            }
        }

        if (typeof index !== 'undefined') {
            array.splice(index, 0, column);
        } else {
            array.push(column);
        }

        if (this.table.$ready) {
            this.updateColumns(); // hack for dynamics insert column
        }
    },
    needScroll(states, isScroll) {
        states.isScroll = isScroll;
    },
    setHeaderHeight(states, height) {
        states.headerHeight = height;
    },
    rowSelectedChanged(states, row) {
        this.toggleRowSelection(row);
        this.updateAllSelected();
    },
};

Store.prototype.commit = function commit(name, ...args) {
    const mutations = this.mutations;

    if (mutations[name]) {
        mutations[name].apply(this, [this.states].concat(args));
    } else {
        throw new Error(`Action not found: ${name}`);
    }
};

export function createStore(table, initialState = {}) {
    const store = new Store();
    store.table = table;

    store.mutations.toggleAllSelection = debounce(store._toggleAllSelection, 10);
    Object.keys(initialState).forEach(key => {
        store.states[key] = initialState[key];
    });

    return store;
}

export function mapStates(mapper) {
    const res = {};

    Object.keys(mapper).forEach(key => {
        const value = mapper[key];
        let fn;
        if (typeof value === 'string') {
            fn = function () {
                return this.store.states[value];
            };
        } else if (typeof value === 'function') {
            fn = function () {
                return value.call(this, this.store.states);
            };
        } else {
            console.error('invalid value type');
        }
        if (fn) {
            res[key] = fn;
        }
    });

    return res;
}
