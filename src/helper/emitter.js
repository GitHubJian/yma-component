const groups = new Map();

function register(vm) {
    const name = vm.$options.componentName;
    if (!name) {
        return;
    }
    let set = groups.get(name);
    if (!set) {
        set = new Set();
        groups.set(name, set);
    }
    set.add(vm);
    vm._ymaEmitterName = name;
}

function unregister(vm) {
    const name = vm._ymaEmitterName;
    if (!name) {
        return;
    }
    const set = groups.get(name);
    if (!set) {
        return;
    }
    set.delete(vm);
    if (!set.size) {
        groups.delete(name);
    }
}

function isDescendant(parent, child) {
    let node = child.$parent;
    while (node) {
        if (node === parent) {
            return true;
        }
        node = node.$parent;
    }
    return false;
}

function walkBroadcast(componentName, eventName, params) {
    this.$children.forEach(child => {
        const name = child.$options.componentName;
        if (name === componentName) {
            child.$emit.apply(child, [eventName].concat(params));
        } else {
            walkBroadcast.apply(child, [componentName, eventName].concat([params]));
        }
    });
}

export default {
    created() {
        register(this);
    },
    beforeDestroy() {
        unregister(this);
    },
    methods: {
        dispatch(componentName, eventName, params) {
            let parent = this.$parent || this.$root;
            let name = parent.$options.componentName;

            while (parent && (!name || name !== componentName)) {
                parent = parent.$parent;

                if (parent) {
                    name = parent.$options.componentName;
                }
            }
            if (parent) {
                parent.$emit.apply(parent, [eventName].concat(params));
            }
        },
        broadcast(componentName, eventName, params) {
            const set = groups.get(componentName);
            if (!set || !set.size) {
                walkBroadcast.call(this, componentName, eventName, params);
                return;
            }

            const args = [eventName].concat(params);
            set.forEach(vm => {
                if (vm !== this && isDescendant(this, vm)) {
                    vm.$emit.apply(vm, args);
                }
            });
        },
    },
};
