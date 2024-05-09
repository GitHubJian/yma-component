<template>
    <div
        :class="{
            'yma-center': true,
            'yma-center--center': align === 'center',
            'yma-center--horizontal': align === 'horizontal',
            'yma-center--vertical': align === 'vertical',
        }"
    >
        <div class="yma-center__inner">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'YmaCenter',
    props: {
        align: {
            type: String,
            default: 'horizontal',
        },
    },
};
</script>

<style lang="scss">
@import 'yma-csskit/bem.scss';

@include b(center) {
    @include m(center) {
        align-items: center;
        justify-content: center;
    }

    @include m(horizontal) {
        justify-content: center;
    }

    @include m(vertical) {
        align-items: center;
    }

    @include e(inner) {
        display: inline-block;
    }

    display: flex;
    width: 100%;
    height: 100%;
}
</style>
