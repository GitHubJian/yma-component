<template>
    <a
        :class="[
            'yma-link',
            disabled && 'is-disabled',
            underline && !disabled && 'is-underline',
            'yma-link--' + type,
        ]"
        @click="handleClick"
    >
        <span class="yma-link__content">
            <span class="yma-link__inner">
                <span v-if="icon" class="yma-link__icon">
                    <yma-icon :name="icon"/>
                </span>

                <span class="yma-link__text">
                    <template v-if="$slots.default">
                        <slot></slot>
                    </template>

                    <template v-else>
                        {{ text }}
                    </template>
                </span>
            </span>
        </span>
    </a>
</template>

<script>
import YmaIcon from '../icon';

export default {
    name: 'YmaLink',
    commponents: {
        YmaIcon,
    },
    props: {
        underline: {
            type: Boolean,
            default: true,
        },
        disabled: Boolean,
        href: String,
        icon: String,
        type: {
            tyle: String,
            default: 'default',
            validator(value) {
                return (
                    ['default', 'info', 'success', 'danger', 'warning'].indexOf(
                        value
                    ) > -1
                );
            },
        },
    },
    data() {
        return {};
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

@include b(link) {
    @include when(disabled) {
        opacity: .3;
        cursor: not-allowed;
    }

    @include e(content) {
        display: flex;
        align-items: center;
    }

    @include e(inner) {
        position: relative;
        padding: 0 2px;
    }

    @include e(icon) {
        width: 14px;
        height: 14px;
        margin-right: 8px;
        font-size: 0;
    }

    @include e((icon, text)) {
        display: inline-block;
        vertical-align: middle;
    }

    @include e(text) {
        font-weight: 400;
        font-size: 14px;
    }

    @include e(inner) {
        @include pseudo(after) {
            content: "";
            position: absolute;
            right: 0;
            bottom: 0;
            left: 0;
            height: 0;
            border-bottom: 1px solid rgba(30, 95, 199, 1);
            visibility: hidden;
        }
    }

    @include m(info) {
        @include e(inner) {
            @include pseudo(after) {
                border-bottom-color: rgba(31, 105, 224, 1);
            }
        }

        color: rgba(31, 105, 224, 1);
    }

    @include m(success) {
        @include e(inner) {
            @include pseudo(after) {
                border-bottom-color: rgba(65, 143, 31, 1);
            }
        }

        color: rgba(65, 143, 31, 1);
    }

    @include m(danger) {
        @include e(inner) {
            @include pseudo(after) {
                border-bottom-color: rgba(221, 51, 50, 1);
            }
        }

        color: rgba(221, 51, 50, 1);
    }

    @include m(warning) {
        @include e(inner) {
            @include pseudo(after) {
                border-bottom-color: rgba(226, 101, 26, 1);
            }
        }

        color: rgba(226, 101, 26, 1);
    }

    position: relative;
    display: inline-flex;
    vertical-align: middle;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 0;
    color: rgba(30, 95, 199, 1);
    outline: none;
    font-size: 0;
    text-decoration: none;
    cursor: pointer;

    &:not(.is-disabled) {
        &.is-underline:hover {
            @include e(inner) {
                @include pseudo(after) {
                    visibility: visible;
                }
            }
        }
    }
}
</style>
