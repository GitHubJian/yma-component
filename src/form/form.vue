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
        model: Object,
        rules: Object,
        labelPosition: String,
        labelWidth: String,
        inline: Boolean,
    },
    data() {
        return {
            potentialLabelWidthArr: [],
            fields: [],
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
            return this.potentialLabelWidthArr.indexOf(width);
        },
        registerLabelWidth(val, oldVal) {
            if (val && oldVal) {
                const index = this.getLabelWidthIndex(oldVal);
                if (index === -1) {
                    this.potentialLabelWidthArr.push(val);
                    return;
                }
                this.potentialLabelWidthArr.splice(index, 1, val);
            }
            else if (val) {
                this.potentialLabelWidthArr.push(val);
            }
        },
        deregisterLabelWidth(val) {
            const index = this.potentialLabelWidthArr.indexOf(val);
            if (index > -1) {
                this.potentialLabelWidthArr.splice(index, 1);
            }
        },
        addField(field) {
            if (field && this.fields.indexOf(field) === -1) {
                this.fields.push(field);
            }
        },
        removeField(field) {
            const index = this.fields.indexOf(field);
            if (index > -1) {
                this.fields.splice(index, 1);
            }
        },
        validate(callback) {
            const fields = this.fields.filter(field => field.prop);
            if (!fields.length) {
                if (typeof callback === 'function') {
                    callback(true, []);
                }
                return Promise.resolve(true);
            }

            return Promise.all(fields.map(field => field.validate(''))).then(messages => {
                const errors = messages.filter(Boolean);
                const valid = errors.length === 0;
                if (typeof callback === 'function') {
                    callback(valid, errors);
                    return valid;
                }
                return valid ? true : Promise.reject(errors);
            });
        },
        validateField(prop, callback) {
            const field = this.fields.filter(item => item.prop === prop)[0];
            if (!field) {
                if (typeof callback === 'function') {
                    callback('');
                }
                return Promise.resolve('');
            }
            return field.validate('', callback);
        },
        resetFields() {
            this.fields.forEach(field => {
                if (typeof field.resetField === 'function') {
                    field.resetField();
                }
            });
        },
        clearValidate(props) {
            const list = props ? [].concat(props) : [];
            this.fields.forEach(field => {
                if (!list.length || list.indexOf(field.prop) > -1) {
                    field.clearValidate();
                }
            });
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