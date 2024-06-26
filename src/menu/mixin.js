export default {
    inject: ['rootMenu'],
    computed: {
        indexPath() {
            const path = [this.index];
            let parent = this.$parent;
            while (parent.$options.componentName !== 'YmaMenu') {
                if (parent.index) {
                    path.unshift(parent.index);
                }
                parent = parent.$parent;
            }
            return path;
        },
        parentMenu() {
            let parent = this.$parent;
            while (parent && ['YmaMenu', 'YmaSubmenu'].indexOf(parent.$options.componentName) === -1) {
                parent = parent.$parent;
            }
            return parent;
        },
    },
};
