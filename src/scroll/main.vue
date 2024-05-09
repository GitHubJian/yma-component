<template>
    <div class="yma-scroll">
        <div class="yma-scroll__inner">
            <div class="yma-scroll__content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'YmaScroll',
};
</script>

<style lang="scss">
@import "yma-csskit/bem.scss";

@include b(scroll) {
    @include e(inner) {
        overflow: auto;
        height: 100%;
    }

    overflow: hidden;
    height: 100%;
}
</style>