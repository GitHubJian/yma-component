<template>
    <div
        class="yma-filter__dropdown"
        :class="[popperClass]"
        :style="{width: width}"
    >
        <ul class="yma-filter__list">
            <slot></slot>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'YmaFilterDropdown',
    componentName: 'YmaFilterDropdown',
    data() {
        return {};
    },
    computed: {
        popperClass() {
            return this.$parent.popperClass;
        },
        width() {
            return this.$parent.dropdownWidth;
        },
    },
    mounted() {
        this.$parent.popperElm = this.popperElm = this.$el;
        this.$on('destroyPopper', this.destroyPopper);
    },
    methods: {
        updatePopper() {},
        destroyPopper() {},
    },
};
</script>

<style lang="scss">
@import 'yma-csskit/bem.scss';

@include b(filter) {
    @include e(dropdown) {
        position: absolute;
        z-index: 1001;
        box-sizing: border-box;
        min-width: max-content;
        margin: 4px 0;
        border: 1px solid rgba(13, 13, 13, .12);
        border-radius: 8px;
        background-color: rgba(255, 255, 255, 1);
        box-shadow: 0 1px 4px rgba(13, 13, 13, .1);
        outline: 1px solid transparent;
    }

    @include e(list) {
        box-sizing: border-box;
        margin: 0;
        padding: 8px;
        list-style: none;
    }
}
</style>
