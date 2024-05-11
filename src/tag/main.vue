<template>
    <span
        :class="['yma-tag', 'yma-tag--' + type, {
            'is-cursor': cursor
        }]" :style="style"
        @click="handleClick"
    >
        <span class="yma-tag__inner">
            <slot></slot>
        </span>
    </span>
</template>

<script>
export default {
    name: 'YmaTag',
    props: {
        cursor: Boolean,
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
    methods: {
        handleClick(e) {
            if (!this.disabled) {
                if (!this.href) {
                    this.$emit('click', e);
                }
            }
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

    @include when(cursor) {
        cursor: pointer;
    }

    color: #0d0d0de5;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    text-align: left;
    user-select: none;
}
</style>