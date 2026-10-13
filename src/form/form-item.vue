<template>
    <div
        class="yma-form-item"
        :class="{
            'is-required': isRequired,
            'is-error': validateState === 'error',
        }"
    >
        <label-wrap
            :is-auto-width="labelStyle && labelStyle.width === 'auto'"
            :update-all="form.labelWidth === 'auto'"
        >
            <label
                v-if="label || $slots.label"
                :for="labelFor"
                class="yma-form-item__label"
                :style="labelStyle"
            >
                <slot name="label">{{ label }}</slot>
            </label>
        </label-wrap>

        <div class="yma-form-item__content" :style="contentStyle">
            <slot></slot>
            <div v-if="validateMessage" class="yma-form-item__error">{{ validateMessage }}</div>
        </div>
    </div>
</template>

<script>
import LabelWrap from './label-wrap';
import {clone, getProp, setProp, normalizeRules, validateRules, matchTrigger} from './validate';

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
        required: {
            type: Boolean,
            default: undefined,
        },
        rules: [Object, Array],
    },
    components: {
        LabelWrap,
    },
    computed: {
        labelFor() {
            return this.for || this.prop;
        },
        labelStyle() {
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
        fieldValue() {
            if (!this.form.model || !this.prop) {
                return undefined;
            }
            return getProp(this.form.model, this.prop);
        },
        isRequired() {
            if (this.required !== undefined) {
                return this.required;
            }
            const formRules = this.form.rules && this.prop ? this.form.rules[this.prop] : [];
            return normalizeRules(formRules, this.rules).some(rule => rule.required);
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
            validateState: '',
            validateMessage: '',
            initialValue: undefined,
        };
    },
    mounted() {
        if (this.prop) {
            this.initialValue = clone(this.fieldValue);
            this.form.addField(this);
        }
    },
    beforeDestroy() {
        if (this.prop && this.form && this.form.removeField) {
            this.form.removeField(this);
        }
    },
    methods: {
        updateComputedLabelWidth(width) {
            this.computedLabelWidth = width ? `${width}px` : '';
        },
        getRules(trigger) {
            const formRules = this.form.rules && this.prop ? this.form.rules[this.prop] : [];
            return normalizeRules(formRules, this.rules).filter(rule => matchTrigger(rule, trigger));
        },
        onFieldBlur() {
            this.validate('blur');
        },
        onFieldChange() {
            this.validate('change');
        },
        validate(trigger, callback) {
            const rules = this.getRules(trigger);
            if (!this.prop) {
                if (typeof callback === 'function') {
                    callback('');
                }
                return Promise.resolve('');
            }
            if (!rules.length) {
                if (!trigger) {
                    this.clearValidate();
                }
                const message = trigger ? this.validateMessage || '' : '';
                if (typeof callback === 'function') {
                    callback(message);
                }
                return Promise.resolve(message);
            }

            return validateRules(rules, this.fieldValue).then(message => {
                this.validateState = message ? 'error' : 'success';
                this.validateMessage = message;
                if (typeof callback === 'function') {
                    callback(message);
                }
                return message;
            });
        },
        clearValidate() {
            this.validateState = '';
            this.validateMessage = '';
        },
        resetField() {
            if (!this.prop || !this.form.model) {
                return;
            }
            setProp(this.form.model, this.prop, clone(this.initialValue));
            this.clearValidate();
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

    @include e(error) {
        padding-top: 2px;
        color: #c25010;
        font-size: 12px;
        line-height: 20px;
    }

    @include when(required) {
        & > .yma-form-item__label::before,
        & .yma-form-item__label-wrap > .yma-form-item__label::before {
            content: "*";
            margin-right: 4px;
            color: rgba(221, 51, 50, 1);
        }
    }

    &::after {
        content: "";
        display: block;
        clear: both;
    }
}
</style>