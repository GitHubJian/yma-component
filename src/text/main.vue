<template>
    <div class="yma-text">
        {{ text }}
    </div>
</template>

<script>
export default {
    name: 'YmaText',
    props: {
        text: String,
    },
};
</script>

<style lang="scss">
@import "yma-csskit/bem.scss";

@include e(text) {
    color: #0d0d0de5;
    font-weight: 400;
    font-size: 14px;
    font-family: PingFang SC;
    line-height: 32px;
    text-align: left;
}
</style>