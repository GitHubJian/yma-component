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
    overflow: auto;
    box-sizing: border-box;
    flex-shrink: 0;
}
</style>