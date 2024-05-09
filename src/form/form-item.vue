<template>
    <div class="yma-form-item">
        <label-wrap :is-auto-width="labelStyle && labelStyle.width === 'auto'" :update-all="form.labelWidth === 'auto'">
            <label
                v-if="label || $slots.label" :for="labelFor"
                class="yma-form-item__label" :style="labelStyle"
            >
                <slot name="label">{{ label }}</slot>
            </label>
        </label-wrap>

        <div class="yma-form-item__content" :style="contentStyle">
            <slot></slot>
        </div>
    </div>
</template>

<script>
import LabelWrap from './label-wrap';

export default {
    name: 'YmaFormItem',
    componentName: 'YmaFormItem',
    provide() {
        return {
            ymaFormItem: this,
        };
    },
    inject: ['ymaForm'],
    props: {
        label: String,
        labelWidth: String,
        prop: String,
    },
    components: {
        LabelWrap,
    },
    computed: {
        labelFor() {
            return this.for || this.prop;
        },
        labelStyle() {
            debugger;
            const ret = {};
            if (this.form.labelPosition === 'top') {
                return ret;
            }

            const labelWidth = this.labelWidth || this.form.labelWidth;
            if (labelWidth) {
                ret.width = labelWidth;
            }

            return ret;
        },
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

@include b(form-item) {
    @include e(label-wrap) {
        float: left;

        .yma-form-item__label {
            display: inline-block;
            float: none;
        }
    }

    @include e(label) {
        vertical-align: middle;
        float: left;
        box-sizing: border-box;
        padding-right: 8px;
        color: #0d0d0d75;
        font-size: 14px;
        line-height: 32px;
        text-align: right;
    }

    @include e(content) {
        position: relative;
        font-size: 14px;
        line-height: 32px;

        &::after {
            content: "";
            display: block;
            clear: both;
        }

        .yma-input-group {
            vertical-align: top;
        }
    }

    &::after {
        content: "";
        display: block;
        clear: both;
    }
}
</style>