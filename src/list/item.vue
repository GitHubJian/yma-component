<template>
    <div class="yma-list__item">
        <span class="yma-list__item-left">
            {{ title }}
        </span>
        <span class="yma-list__item-right">
            <slot></slot>
        </span>
    </div>
</template>


<script>
export default {
    name: 'YmaListItem',
    props: {
        title: {
            type: String,
            required: true,
        },
    },
};
</script>


<style lang="scss">
@import "yma-csskit/bem.scss";

@include b(list) {
    @include e(item) {
        height: 30px;
        line-height: 30px;

        &::after {
            content: "";
            display: block;
            clear: both;
        }

        & + & {
            margin-top: 12px;
        }
    }

    @include e(item-left) {
        float: left;
        color: var(---kd-color-text-secondary, #0d0d0da8);
        font-weight: 400;
        font-size: 14px;
        font-family: PingFang SC;
        text-align: left;
    }

    @include e(item-right) {
        float: right;
        color: #0d0d0de5;
        font-weight: 600;
        font-size: 18px;
        font-family: PingFang SC;
        text-align: center;
    }
}
</style>