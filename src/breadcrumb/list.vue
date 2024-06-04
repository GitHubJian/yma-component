<template>
    <div class="yma-breadcrumb">
        <slot></slot>
    </div>
</template>
<script>
export default {
    name: 'YmaBreadcrumb',
    props: {
        separator: {
            type: String,
            default: '/',
        },
        separatorClass: {
            type: String,
            default: '',
        },
    },
    provide() {
        return {
            ymaBreadcrumb: this,
        };
    },
};
</script>

<style lang="scss">
@import "yma-csskit/bem.scss";

@include b(breadcrumb) {
    @include e(item) {
        float: left;

        &:last-child {
            .yma-breadcrumb__inner {
                font-weight: 600;
            }

            .yma-breadcrumb__separator {
                display: none;
            }
        }
    }

    @include e(inner) {
        @include when(link) {
            cursor: pointer;
        }

        display: inline-block;
        vertical-align: middle;
    }

    @include e(separator) {
        display: inline-block;
        vertical-align: middle;
        width: 16px;
        height: 16px;
        margin: 0 8px;
        line-height: 16px;
    }

    font-weight: 400;
    font-size: 14px;
    font-family: PingFang SC;
    line-height: 32px;
    text-align: left;

    &::after {
        content: "";
        display: block;
        clear: both;
    }
}
</style>