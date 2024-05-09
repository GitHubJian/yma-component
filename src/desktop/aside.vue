<template>
    <aside class="yma-aside" :style="{ width }">
        <slot></slot>
    </aside>
</template>

<script>
export default {
    name: 'YmaAside',
    componentName: 'YmaAside',
    props: {
        width: {
            type: String,
            default: '300px',
        },
    },
};
</script>

<style lang="scss">
@import 'yma-csskit/bem.scss';

@include b(aside) {
    flex-shrink: 0;
    overflow: auto;
    box-sizing: border-box;
}
</style>