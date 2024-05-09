<template>
    <div
        :class="{
            'yma-submenu': true,
            'is-active': active,
            'is-opened': opened,
        }"
    >
        <div
            class="yma-submenu__inner" @click="handleClick"
            @mouseenter="handleMouseenter"
            @mouseleave="handleMouseleave"
        >
            <span class="yma-menu__toggle">
                <yma-icon name="arrow-down"/>
            </span>
            <span class="yma-menu__icon">
                <yma-icon :name="icon"/>
            </span>
            <span class="yma-menu__title">{{ title }}</span>
        </div>

        <div v-show="opened" class="yma-menu yma-menu--inline">
            <slot></slot>
        </div>
    </div>
</template>

<script>
import emitter from '../helper/emitter';
import mixin from './mixin';

export default {
    name: 'YmaSubmenu',
    componentName: 'YmaSubmenu',
    mixins: [emitter, mixin],
    props: {
        index: {
            type: String,
            required: true,
        },
        showTimeout: {
            type: Number,
            default: 300,
        },
        hideTimeout: {
            type: Number,
            default: 300,
        },
        disabled: Boolean,
        icon: {
            type: String,
        },
        title: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            timeout: null,
            items: {},
            submenus: {},
            mouseInChild: false,
        };
    },
    computed: {
        opened() {
            return this.rootMenu.openedMenus.indexOf(this.index) > -1;
        },
        active() {
            let isActive = false;
            const submenus = this.submenus;
            const items = this.items;

            Object.keys(items).forEach(index => {
                if (items[index].active) {
                    isActive = true;
                }
            });

            Object.keys(submenus).forEach(index => {
                if (submenus[index].active) {
                    isActive = true;
                }
            });

            return isActive;
        },
    },
    methods: {
        handleCollapseToggle(value) {
        },
        addItem(item) {
            this.$set(this.items, item.index, item);
        },
        removeItem(item) {
            delete this.items[item.index];
        },
        addSubmenu(item) {
            this.$set(this.submenus, item.index, item);
        },
        removeSubmenu(item) {
            delete this.submenus[item.index];
        },
        handleClick() {
            const {rootMenu, disabled} = this;
            if (
                (rootMenu.collapse)
                || disabled
            ) {
                return;
            }

            this.dispatch('YmaMenu', 'submenu-click', this);
        },
        handleMouseenter(event, showTimeout = this.showTimeout) {
            const {rootMenu, disabled} = this;
            if (
                !rootMenu.collapse
                || disabled
            ) {
                return;
            }

            this.dispatch('YmaSubmenu', 'mouse-enter-child');

            clearTimeout(this.timeout);

            this.timeout = setTimeout(() => {
                this.rootMenu.openMenu(this.index, this.indexPath);
            }, showTimeout);
        },
        handleMouseleave() {
            const {rootMenu} = this;
            if (

                (!rootMenu.collapse)
            ) {
                return;
            }
            this.dispatch('YmaSubmenu', 'mouse-leave-child');

            clearTimeout(this.timeout);

            this.timeout = setTimeout(() => {
                !this.mouseInChild && this.rootMenu.closeMenu(this.index);
            }, this.hideTimeout);
        },
    },
    created() {
        this.$on('toggle-collapse', this.handleCollapseToggle);

        this.$on('mouse-enter-child', () => {
            this.mouseInChild = true;
            clearTimeout(this.timeout);
        });

        this.$on('mouse-leave-child', () => {
            this.mouseInChild = false;
            clearTimeout(this.timeout);
        });
    },
    mounted() {
        this.parentMenu.addSubmenu(this);
        this.rootMenu.addSubmenu(this);
    },
    beforeDestroy() {
        this.parentMenu.removeSubmenu(this);
        this.rootMenu.removeSubmenu(this);
    },
};
</script>

<style lang="scss">
@import "yma-csskit/bem.scss";

@include b(submenu) {
    @include e(inner) {
        box-sizing: border-box;
        height: 36px;
        padding: 10px 4px 10px 4px;
        color: var(---kd-color-text-primary, #0d0d0de5);
        font-weight: 400;
        font-size: 14px;
        font-family: PingFang SC;
        line-height: 14px;
        text-align: left;
        cursor: pointer;
    }
}
</style>