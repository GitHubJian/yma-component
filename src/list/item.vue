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
    name: "YmaListItem",
    props: {
        title: {
            type: String,
            required: true
        },
    },
}
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

        &+& {
            margin-top: 12px;
        }
    }

    @include e(item-left) {
        float: left;
        font-family: PingFang SC;
        font-size: 14px;
        font-weight: 400;
        text-align: left;
        color: var(---kd-color-text-secondary, #0D0D0DA8);
    }

    @include e(item-right) {
        float: right;
        font-family: PingFang SC;
        font-size: 18px;
        font-weight: 600;
        text-align: center;
        color: #0D0D0DE5;
    }
}
</style>