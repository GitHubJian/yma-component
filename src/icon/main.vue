<template>
    <span
        :class="[
            {
                'yma-icon': true,
                'is-cover': isCover,
            },
            'yma-icon-' + name,
        ]"
        :style="customStyle"
    >
        <svg class="yma-icon__inner">
            <use :xlink:href="href"/>
        </svg>
    </span>
</template>

<script>
export default {
    name: 'YmaIcon',
    props: {
        name: String,
        isCover: {
            type: Boolean,
            default: false,
        },
        size: {
            type: String,
            default: '16px',
        },
    },
    computed: {
        href() {
            return `#${this.name}`;
        },
        customStyle() {
            if (this.isCover) {
                return null;
            }

            if (this.size) {
                return `width: ${this.size}; height: ${this.size};`;
            }

            return null;
        },
    },
};
</script>

<style lang="scss">
@import "yma-csskit/bem.scss";

@include b(icon) {
    @include when(cover) {
        width: 100%;
        height: 100%;
    }

    @include e(inner) {
        width: 100%;
        height: 100%;
    }

    display: inline-block;
    vertical-align: middle;
    width: 16px;
    height: 16px;
    font-size: 0;

    & + .yma-icon-next {
        display: inline-block;
        vertical-align: middle;
    }
}
</style>
