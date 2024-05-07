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
    name: "YmaPanel"
}
</script>

<style lang="scss">
@import 'yma-csskit/bem.scss';

@include b(panel) {
    display: flex;
    flex-direction: column;
    padding: 20px 32px 20px 32px;
    border-radius: 8px;
    background: #FFFFFF;
    gap: 12px;
    overflow: hidden;
    height: 100%;

    @include e(title) {
        font-family: PingFang SC;
        font-size: 16px;
        font-weight: 600;
        line-height: 24px;
        text-align: left;
        color: var(---kd-color-text-primary, #0D0D0DE5);
    }

    @include e(body) {
        flex: 1;
        overflow: hidden;
    }
}
</style>