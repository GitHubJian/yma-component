import Vue from 'vue';

const Store = Vue.extend({
    data() {
        return {
            states: {
                _list: [],
                list: [],
            },
        };
    },
    methods: {
        updateList() {
            const states = this.states;

            states.list = states._list;
        },
    },
});

Store.prototype.mutations = {
    setData(states, data) {
        states.data = data;
    },
    insert(states, item, index) {
        let array = states._list;
        if (typeof index !== 'undefined') {
            array.splice(index, 0, item);
        } else {
            array.push(item);
        }

        if (this.instance.$ready) {
            this.updateList();
        }
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

export function createStore(instance, initialState = {}) {
    const store = new Store();
    store.instance = instance;

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
