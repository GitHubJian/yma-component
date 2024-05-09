<template>
    <footer class="yma-footer" :style="{ height }">
        <slot></slot>
    </footer>
</template>

<script>
export default {
    name: 'YmaFooter',
    componentName: 'YmaFooter',
    props: {
        height: {
            type: String,
            default: '60px',
        },
    },
};
</script>

<style lang="scss">
@import 'yma-csskit/bem.scss';

@include b(footer) {
    flex-shrink: 0;
    box-sizing: border-box;
}
</style>