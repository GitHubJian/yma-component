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
    name: "YmaScroll",
}
</script>

<style lang="scss">
@import "yma-csskit/bem.scss";

@include b(scroll) {
    height: 100%;
    overflow: hidden;

    @include e(inner) {
        height: 100%;
        overflow: auto;
    }
}
</style>