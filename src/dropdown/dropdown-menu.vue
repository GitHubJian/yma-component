<template>
    <ul v-show="showPopper" class="yma-dropdown-menu">
        <yma-dropdown-menu-item
            v-if="isShowAll" id="-1"
            label="全部"
        />
        <slot></slot>
    </ul>
</template>

<script>
import YmaDropdownMenuItem from './dropdown-item.vue';

export default {
    name: 'YmaDropdownMenu',
    componentName: 'YmaDropdownMenu',
    inject: ['dropdown'],
    components: {
        YmaDropdownMenuItem,
    },
    props: {
        all: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            showPopper: false,
        };
    },
    created() {
        this.$on('visible', val => {
            this.showPopper = val;
        });
    },
    computed: {
        isShowAll() {
            return this.dropdown.multiple && this.all;
        },
    },
    mounted() {
        this.dropdown.popperEl = this.popperEl = this.$el;
        this.referenceEl = this.dropdown.$el;

        this.dropdown.initDomOperation();
    },

};
</script>

<style lang="scss">
@import 'yma-csskit/bem.scss';

@include b(dropdown-menu) {
    position: absolute;
    top: 34px;
    left: 0;
    z-index: 20;
    width: 210px;
    padding: 12px 12px;
    border: 1px solid rgba(13, 13, 13, .12);
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 12px 32px 0 rgba(13, 13, 13, .08);
}
</style>
