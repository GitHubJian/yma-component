<template>
    <div class="yma-pane">
        <div v-if="$slots.title" class="yma-pane__header">
            <div class="yma-pane__title">
                <slot name="title"></slot>
            </div>
        </div>

        <div class="yma-pane__body">
            <slot></slot>
        </div>

        <div v-if="$slots.footer" class="yma-pane__footer">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'YmaPane',
};
</script>

<style lang="scss">
@import 'yma-csskit/bem.scss';

@include b(pane) {
    @include e(header) {
        padding: 10px 15px;
        border-color: #ddd;
        border-bottom: 1px solid transparent;
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
        background-color: #f5f5f5;
        color: #333;
    }

    @include e(body) {
        padding: 15px;
    }

    @include e(footer) {
        padding: 10px 15px;
        border-top: 1px solid #ddd;
        border-bottom-right-radius: 3px;
        border-bottom-left-radius: 3px;
        background-color: #f5f5f5;
    }

    overflow: hidden;
    border: 1px solid #ddd;
    border-radius: 3px;
    background-color: #fff;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
}
</style>
