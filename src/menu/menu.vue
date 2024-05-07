<template>
    <div class="cms-menu">
        <slot></slot>
    </div>
</template>

<script>
import emitter from '../helper/emitter'

export default {
    name: 'YmaMenu',
    componentName: "YmaMenu",
    mixins: [emitter],
    provide () {
        return {
            rootMenu: this
        };
    },
    props: {
        defaultActive: {
            type: String,
            default: ''
        },
        defaultOpeneds: Array,
        collapse: Boolean,
    },
    data () {
        return {
            activeIndex: this.defaultActive,
            openedMenus: (this.defaultOpeneds && !this.collapse) ? this.defaultOpeneds.slice(0) : [],
            items: {},
            submenus: {}
        }
    },
    watch: {
        defaultActive (newVal) {
            if (!this.items[newVal]) {
                this.activeIndex = null;
            }

            this.updateActiveIndex(newVal)
        },
        defaultOpeneds (value) {
            if (!this.collapse) {
                this.openedMenus = value;
            }
        },
        collapse (value) {
            if (value) {
                this.openedMenus = [];
            }

            this.broadcast('YmaSubmenu', 'toggle-collapse', value);
        }
    },
    methods: {
        updateActiveIndex (val) {
            const item = this.items[val] || this.items[this.activeIndex] || this.items[this.defaultActive];
            if (item) {
                this.activeIndex = item.index;
                this.initOpenedMenu();
            } else {
                this.activeIndex = null;
            }
        },
        addItem (item) {
            this.$set(this.items, item.index, item);
        },
        removeItem (item) {
            delete this.items[item.index];
        },
        addSubmenu (item) {
            this.$set(this.submenus, item.index, item);
        },
        removeSubmenu (item) {
            delete this.submenus[item.index];
        },
        openMenu (index, indexPath) {
            let openedMenus = this.openedMenus;
            if (openedMenus.indexOf(index) !== -1) {
                return;
            }

            if (this.uniqueOpened) {
                this.openedMenus = openedMenus.filter(index => {
                    return indexPath.indexOf(index) !== -1;
                });
            }

            this.openedMenus.push(index);
        },
        closeMenu (index) {
            const i = this.openedMenus.indexOf(index);
            if (i !== -1) {
                this.openedMenus.splice(i, 1);
            }
        },
        handleSubmenuClick (submenu) {
            const { index, indexPath } = submenu;
            let isOpened = this.openedMenus.indexOf(index) !== -1;

            if (isOpened) {
                this.closeMenu(index);
                this.$emit('close', index, indexPath);
            } else {
                this.openMenu(index, indexPath);
                this.$emit('open', index, indexPath);
            }
        },
        handleItemClick (item) {
            const { index, indexPath } = item;
            const hasIndex = item.index !== null;

            if (hasIndex) {
                this.activeIndex = item.index;
            }

            this.$emit('select', index, indexPath, item);
        },
        initOpenedMenu () {
            const index = this.activeIndex;
            const activeItem = this.items[index];
            if (!activeItem || this.collapse) return;

            let indexPath = activeItem.indexPath;

            indexPath.forEach(index => {
                let submenu = this.submenus[index];
                submenu && this.openMenu(index, submenu.indexPath);
            });
        },
        open (index) {
            const { indexPath } = this.submenus[index.toString()];
            indexPath.forEach(i => this.openMenu(i, indexPath));
        },
        close (index) {
            this.closeMenu(index);
        }
    },
    mounted () {
        this.initOpenedMenu();
        this.$on('item-click', this.handleItemClick);
        this.$on('submenu-click', this.handleSubmenuClick);
        this.$watch('items', this.updateActiveIndex);
    }
};
</script>

<style lang="scss">
@import "yma-csskit/bem.scss";

@include b(menu) {
    font-size: 0;
}
</style>