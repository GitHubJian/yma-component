<template>
    <main class="yma-main">
        <div class="yma-content">
            <slot></slot>
        </div>
    </main>
</template>

<script>
export default {
    name: 'YmaMain',
    componentName: 'YmaMain',
};
</script>

<style lang="scss">
@import 'yma-csskit/bem.scss';

@include b(main) {
    display: block;
    flex: 1;
    // flex-basis: auto;
    box-sizing: border-box;
    overflow: hidden;
}
</style>