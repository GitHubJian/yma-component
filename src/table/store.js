import Vue from 'vue';

const Store = Vue.extend({
    data() {
        return {
            states: {
                data: [],

                _columns: [],
                columns: [],

                isScroll: false,

                headerHeight: 0,
            },
        };
    },
    methods: {
        updateColumns() {
            const states = this.states;
            const _columns = states._columns || [];
            //
            states.columns = _columns;
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