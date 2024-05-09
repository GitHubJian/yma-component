<template>
    <span :class="['yma-tag', 'yma-tag--' + type]" :style="style">
        <span class="yma-tag__inner">
            <slot></slot>
        </span>
    </span>
</template>

<script>
export default {
    name: 'YmaTag',
    props: {
        type: {
            tyle: String,
            default: 'default',
            validator(value) {
                return [
                    'default',
                    'primary',
                    'warning',
                    'danger',
                ].indexOf(value) > -1;
            },
        },
    },
    computed: {
        style() {
            if (!this.color) {
                return {};
            }

            return {
                color: this.color,
            };
        },
    },
};
</script>

<style lang="scss">
@import "yma-csskit/bem.scss";

@include b(tag) {
    @include m(default) {
        color: #0d0d0de5;
    }

    @include m(primary) {
        color: #3b64fc;
    }

    @include m(warning) {
        color: #347317;
    }

    @include m(danger) {
        color: #c25010;
    }

    color: #0d0d0de5;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    text-align: left;
}
</style>