<template>
    <button
        class="yma-button"
        :disabled="buttonDisabled || loading"
        :autofocus="autofocus"
        :type="nativeType"
        :class="[
            type ? 'yma-button--' + type : '',
            buttonSize ? 'yma-button--' + buttonSize : '',
            {
                'is-disabled': buttonDisabled,
                'is-loading': loading,
                'is-plain': plain,
                'is-round': round,
                'is-circle': circle,
            },
        ]"
        @click="handleClick"
    >
        <yma-icon v-if="loading" name="loading"/>
        <yma-icon v-if="icon && !loading" :name="icon"/>
        <span v-if="$slots.default">
            <slot></slot>
        </span>
    </button>
</template>

<script>
import YmaIcon from '../icon';

export default {
    name: 'YmaButton',
    components: {
        YmaIcon,
    },
    inject: {
        ymaForm: {
            default: '',
        },
        ymaFormItem: {
            default: '',
        },
    },
    props: {
        type: {
            type: String,
            default: 'default',
        },
        size: String,
        icon: {
            type: String,
            default: '',
        },
        nativeType: {
            type: String,
            default: 'button',
        },
        loading: Boolean,
        disabled: Boolean,
        plain: Boolean,
        autofocus: Boolean,
        round: Boolean,
        circle: Boolean,
    },
    computed: {
        _ymaFormItemSize() {
            return (this.ymaFormItem || {}).ymaFormItemSize;
        },
        buttonSize() {
            return (
                this.size || this._ymaFormItemSize || (this.$ELEMENT || {}).size
            );
        },
        buttonDisabled() {
            return this.$options.propsData.hasOwnProperty('disabled')
                ? this.disabled
                : (this.ymaForm || {}).disabled;
        },
    },
    methods: {
        handleClick(e) {
            this.$emit('click', e);
        },
    },
};
</script>

<style lang="scss">


$--button-height: 32px;
$--button-font-size: 14px;
$--button-color: #0d0d0de5;
$--button-border: rgba(13, 13, 13, .12);
$--button-radius: 6px;
$--button-primary: #3b64fc;
$--button-success: #418f1f;
$--button-warning: #e2651a;
$--button-danger: #dd3332;
$--button-info: #1f69e0;

@import 'yma-csskit/bem.scss';

@mixin button-size($height, $padding, $font-size, $radius) {
    @include when(circle) {
        width: $height;
        padding: 0;
        border-radius: 50%;
    }

    height: $height;
    padding: 0 $padding;
    border-radius: $radius;
    font-size: $font-size;
}

@mixin button-solid($color, $hover, $active) {
    @include when(plain) {
        @include when(disabled) {
            &,
            &:hover,
            &:focus,
            &:active {
                border-color: rgba($color, .16);
                background-color: rgba($color, .06);
                color: rgba($color, .45);
            }
        }

        border-color: rgba($color, .45);
        background-color: rgba($color, .08);
        color: $color;

        &:hover,
        &:focus {
            border-color: $color;
            background-color: $color;
            color: #fff;
        }

        &:active {
            border-color: $active;
            background-color: $active;
            color: #fff;
        }
    }

    @include when(disabled) {
        &,
        &:hover,
        &:focus,
        &:active {
            border-color: rgba($color, .35);
            background-color: rgba($color, .35);
            color: #fff;
        }
    }

    border-color: $color;
    background-color: $color;
    color: #fff;

    &:hover,
    &:focus {
        border-color: $hover;
        background-color: $hover;
        color: #fff;
    }

    &:active {
        border-color: $active;
        background-color: $active;
        color: #fff;
    }
}

@keyframes yma-button-loading {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

@include b(button) {
    @include button-size(
        $--button-height,
        16px,
        $--button-font-size,
        $--button-radius
    );

    @include when(plain) {
        &:hover,
        &:focus {
            border-color: $--button-primary;
            background-color: #fff;
            color: $--button-primary;
        }

        &:active {
            border-color: #2a4fe0;
            background-color: rgba(59, 100, 252, .06);
            color: #2a4fe0;
        }
    }

    @include when(disabled) {
        &,
        &:hover,
        &:focus,
        &:active {
            border-color: rgba(13, 13, 13, .08);
            background-color: rgba(13, 13, 13, .04);
            color: rgba(13, 13, 13, .3);
            cursor: not-allowed;
        }
    }

    @include when(loading) {
        cursor: default;
        pointer-events: none;

        .yma-icon {
            animation: yma-button-loading 1s linear infinite;
        }
    }

    @include when(round) {
        border-radius: 999px;
    }

    @include when(circle) {
        border-radius: 50%;
    }

    @include m(large) {
        @include button-size(40px, 20px, 16px, 8px);
    }

    @include m(medium) {
        @include button-size(36px, 16px, $--button-font-size, $--button-radius);
    }

    @include m(small) {
        @include button-size(28px, 12px, 12px, 4px);
    }

    @include m(mini) {
        @include button-size(24px, 10px, 12px, 4px);
    }

    @include m(primary) {
        @include button-solid($--button-primary, #587bfd, #355ae3);
    }

    @include m(success) {
        @include button-solid($--button-success, #5ea040, #3a801c);
    }

    @include m(warning) {
        @include button-solid($--button-warning, #e67c3c, #cb5b17);
    }

    @include m(danger) {
        @include button-solid($--button-danger, #e25251, #c72e2d);
    }

    @include m(info) {
        @include button-solid($--button-info, #4180e5, #1c5fca);
    }

    @include m(text) {
        @include when(disabled) {
            &,
            &:hover,
            &:focus,
            &:active {
                border-color: transparent;
                background-color: transparent;
                color: rgba(13, 13, 13, .3);
            }
        }

        padding-right: 0;
        padding-left: 0;
        border-color: transparent;
        background-color: transparent;
        color: $--button-primary;

        &:hover,
        &:focus {
            border-color: transparent;
            background-color: transparent;
            color: #587bfd;
        }

        &:active {
            border-color: transparent;
            background-color: transparent;
            color: #355ae3;
        }
    }

    display: inline-flex;
    vertical-align: middle;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    margin: 0;
    border: 1px solid $--button-border;
    background-color: #fff;
    color: $--button-color;
    outline: none;
    font-weight: 400;
    font-family: inherit;
    line-height: 22px;
    text-align: center;
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
    transition:
        color .2s,
        background-color .2s,
        border-color .2s;
    appearance: none;

    & + & {
        margin-left: 8px;
    }

    .yma-icon + span {
        margin-left: 6px;
    }

    &:hover,
    &:focus {
        border-color: rgba(59, 100, 252, .45);
        background-color: rgba(59, 100, 252, .06);
        color: $--button-primary;
    }

    &:active {
        border-color: #2a4fe0;
        background-color: rgba(59, 100, 252, .12);
        color: #2a4fe0;
    }
}
</style>
