<template>
    <div class="yma-panel">
        <div v-if="$slots.title" class="yma-panel__header">
            <div class="yma-panel__title">
                <slot name="title"></slot>
            </div>
        </div>

        <div class="yma-panel__body">
            <slot></slot>
        </div>

        <div v-if="$slots.footer" class="yma-panel__footer">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'YmaPanel',
};
</script>

<style lang="scss">
@import 'yma-csskit/bem.scss';

@include b(panel) {
    @include e(title) {
        color: var(---kd-color-text-primary, #0d0d0de5);
        font-weight: 600;
        font-size: 16px;
        font-family: PingFang SC;
        line-height: 24px;
        text-align: left;
    }

    @include e(body) {
        flex: 1;
        overflow: hidden;
    }

    display: flex;
    flex-direction: column;
    gap: 12px;
    overflow: hidden;
    height: 100%;
    padding: 20px 32px 20px 32px;
    border-radius: 8px;
    background: #fff;
}
</style>