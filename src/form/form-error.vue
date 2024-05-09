<template>
    <div class="yma-form-error">
        <div class="yma-form-error__content" :style="contentStyle">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'YmaFormError',
    provide() {
        return {
            ymaFormItem: this,
        };
    },
    inject: ['ymaForm'],
    props: {
        msg: String,
    },
    computed: {
        contentStyle() {
            const ret = {};
            const label = this.label;

            if (this.form.labelPosition === 'top' || this.form.inline) {
                return ret;
            }

            if (!label && !this.labelWidth && this.isNested) {
                return ret;
            }

            const labelWidth = this.labelWidth || this.form.labelWidth;
            if (labelWidth === 'auto') {
                if (this.labelWidth === 'auto') {
                    ret.marginLeft = this.computedLabelWidth;
                }
                else if (this.form.labelWidth === 'auto') {
                    ret.marginLeft = this.ymaForm.autoLabelWidth;
                }
            }
            else {
                ret.marginLeft = labelWidth;
            }

            return ret;
        },
        form() {
            let parent = this.$parent;
            let parentName = parent.$options.componentName;
            while (parentName !== 'YmaForm') {
                if (parentName === 'YmaFormItem') {
                    this.isNested = true;
                }

                parent = parent.$parent;
                parentName = parent.$options.componentName;
            }

            return parent;
        },
    },
    data() {
        return {
            computedLabelWidth: '',
        };
    },
    methods: {
        updateComputedLabelWidth(width) {
            this.computedLabelWidth = width ? `${width}px` : '';
        },
    },
};

</script>


<style lang="scss">
@import "yma-csskit/bem.scss";

@include b(form-error) {
    @include e(content) {
        height: 20px;
        color: #c25010;
        font-weight: 400;
        font-size: 12px;
        font-family: PingFang SC;
        line-height: 20px;
        text-align: left;

        &::after {
            content: "";
            display: block;
            clear: both;
        }
    }

    &::after {
        content: "";
        display: block;
        clear: both;
    }
}
</style>