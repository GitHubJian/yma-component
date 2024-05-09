<template>
    <header class="yma-header" :style="{ height }">
        <slot></slot>
    </header>
</template>

<script>
export default {
    name: 'YmaHeader',
    componentName: 'YmaHeader',
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

@include b(header) {
    flex-shrink: 0;
    box-sizing: border-box;
}
</style>
