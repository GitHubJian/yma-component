<template>
    <section
        class="yma-container" :class="{ 'is-vertical': isVertical }"
        :style="{
            'gap': gap
        }"
    >
        <slot></slot>
    </section>
</template>

<script>
export default {
    name: 'YmaContainer',
    componentName: 'YmaContainer',
    props: {
        direction: String,
        gap: {
            type: String,
            default: '0px',
        },
    },
    computed: {
        isVertical() {
            if (this.direction === 'vertical') {
                return true;
            }

            else if (this.direction === 'horizontal') {
                return false;
            }

            return this.$slots && this.$slots.default
                ? this.$slots.default.some(vnode => {
                    const tag = vnode.componentOptions && vnode.componentOptions.tag;
                    return tag === 'yma-header' || tag === 'yma-footer';
                })
                : false;
        },
    },
};
</script>


<style lang="scss">
@import 'yma-csskit/bem.scss';

@include b(container) {
    @include when(vertical) {
        flex-direction: column;
    }

    display: flex;
    flex: 1;
    flex-basis: auto;
    flex-direction: row;
    overflow: hidden;
    box-sizing: border-box;
    min-width: 0;
}
</style>