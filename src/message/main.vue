<template>
    <div
        :class="[
            'yma-message',
            'yma-message--' + type,
            {
                'yma-message--border': border,
            },
        ]"
    >
        <yma-icon :name="type"></yma-icon>
        <span class="yma-message__content yma-icon-next">{{ message }}</span>
    </div>
</template>

<script>
export default {
    name: "YmaMessage",
    props: {
        type: {
            type: String,
            default: "info",
            validator: function (val) {
                return (
                    ["info", "success", "warning", "error"].indexOf(val) > -1
                );
            },
        },
        message: {
            type: String,
        },
        border: {
            type: Boolean,
        },
    },
};
</script>

<style lang="scss">
@import "yma-csskit/bem.scss";

@include b(message) {
    height: 40px;
    padding: 8px 12px 8px 12px;
    border-radius: 4px;

    @include m(border) {
        border: 1px solid transparent;
    }

    @include m(info) {
        background-color: rgba(237, 244, 255, 1);
        border-color: rgba(31, 105, 224, 1);
    }

    @include m(success) {
        background-color: rgba(233, 246, 227, 1);
        border-color: rgba(65, 143, 31, 1);
    }

    @include m(warning) {
        background-color: rgba(254, 241, 234, 1);
        border-color: rgba(226, 101, 26, 1);
    }

    @include m(error) {
        background-color: rgba(254, 241, 241, 1);
        border-color: rgba(221, 51, 50, 1);
    }

    @include e(content) {
        margin-left: 4px;
    }
}
</style>