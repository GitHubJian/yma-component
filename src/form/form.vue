<template>
    <form
        :class="[
            'yma-form',
            labelPosition ? 'yma-form--label-' + labelPosition : '',
        ]"
    >
        <slot></slot>
    </form>
</template>

<script>
export default {
    name: 'YmaForm',
    componentName: 'YmaForm',
    provide() {
        return {
            ymaForm: this,
        };
    },
    props: {
        labelPosition: String,
        labelWidth: String,
    },
    data() {
        return {
            potentialLabelWidthArr: [],
        };
    },
    computed: {
        autoLabelWidth() {
            if (!this.potentialLabelWidthArr.length) {
                return 0;
            }

            const max = Math.max(...this.potentialLabelWidthArr);
            return max ? `${max}px` : '';
        },
    },
    methods: {
        getLabelWidthIndex(width) {
            const index = this.potentialLabelWidthArr.indexOf(width);
            // it's impossible
            if (index === -1) {
                throw new Error('[YmaForm]unpected width ', width);
            }
            return index;
        },
        registerLabelWidth(val, oldVal) {
            if (val && oldVal) {
                const index = this.getLabelWidthIndex(oldVal);
                this.potentialLabelWidthArr.splice(index, 1, val);
            }
            else if (val) {
                this.potentialLabelWidthArr.push(val);
            }
        },
    },
};

</script>

<style lang="scss">
@import "yma-csskit/bem.scss";

@include b(form) {
    position: relative;
}
</style>