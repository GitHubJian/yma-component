<template>
    <label
        :class="{
            'yma-checkbox': true,
            'is-disabled': isDisabled,
            'is-checked': isChecked
        }"
    >
        <span
            :class="{
                'yma-checkbox__input': true,
                'is-disabled': isDisabled,
                'is-checked': isChecked
            }"
        >
            <span class="yma-checkbox__inner"></span>

            <input
                v-if="trueLabel || falseLabel" v-model="model"
                class="yma-checkbox__original" type="checkbox"
                :name="name" :disabled="isDisabled"
                :true-value="trueLabel" :false-value="falseLabel"
                @change="handleChange" @focus="focus = true"
                @blur="focus = false"
            >
            <input
                v-else v-model="model"
                class="el-checkbox__original" type="checkbox"
                :disabled="isDisabled"
                :value="label" :name="name"
                @change="handleChange" @focus="focus = true"
                @blur="focus = false"
            >
        </span>
        <span v-if="$slots.default || label" class="yma-checkbox__label">
            <slot></slot>
            <template v-if="!$slots.default">{{ label }}</template>
        </span>
    </label>
</template>

<script>
export default {
    name: 'YmaCheckbox',
    componentName: 'YmaCheckbox',
    props: {
        value: {},
        label: {},
        disabled: Boolean,
        checked: Boolean,
        name: String,
        trueLabel: [String, Number],
        falseLabel: [String, Number],
        id: String,
    },
    data() {
        return {
            selfModel: false,
            focus: false,
        };
    },
    computed: {
        model: {
            get() {
                return this.value !== undefined ? this.value : this.selfModel;
            },
            set(val) {
                this.$emit('input', val);
                this.selfModel = val;
            },
        },
        isChecked() {
            if ({}.toString.call(this.model) === '[object Boolean]') {
                return this.model;
            }
            else if (Array.isArray(this.model)) {
                return this.model.indexOf(this.label) > -1;
            }
            else if (this.model !== null && this.model !== undefined) {
                return this.model === this.trueLabel;
            }
        },
        store() {
            return this.value;
        },
        isDisabled() {
            return this.disabled;
        },
    },
    methods: {
        addToStore() {
            if (
                Array.isArray(this.model)
                && this.model.indexOf(this.label) === -1
            ) {
                this.model.push(this.label);
            }
            else {
                this.model = this.trueLabel || true;
            }
        },
        handleChange(ev) {
            let value;
            if (ev.target.checked) {
                value = this.trueLabel === undefined ? true : this.trueLabel;
            }
            else {
                value = this.falseLabel === undefined ? false : this.falseLabel;
            }
            this.$emit('change', value, ev);
        },
    },
};
</script>

<style lang="scss">
@import "yma-csskit/bem.scss";

@include b(checkbox) {
    @include e(input) {
        @include when(checked) {
            .yma-checkbox__inner {
                border-color: #fff;
                background-color: rgba(31, 105, 224, 1);

                &::after {
                    transform: rotate(45deg) scaleY(1);
                }
            }
        }

        position: relative;
        display: inline-block;
        vertical-align: middle;
        outline: none;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
    }

    @include e(inner) {
        position: relative;
        z-index: 1;
        display: inline-block;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 1px solid rgba(13, 13, 13, .48);
        border-radius: 2px;
        background-color: rgba(255, 255, 255, 1);

        &::after {
            content: "";
            position: absolute;
            top: 1px;
            left: 5px;
            box-sizing: content-box;
            width: 3px;
            height: 7px;
            border: 1px solid #fff;
            border-top: 0;
            border-left: 0;
            transition: transform .15s ease-in .05s;
            transform: rotate(45deg) scaleY(0);
            transform-origin: center;
        }
    }

    @include e(original) {
        position: absolute;
        z-index: -1;
        width: 0;
        height: 0;
        margin: 0;
        outline: none;
        opacity: 0;
    }

    @include e(lable) {
        display: inline-block;
        vertical-align: middle;
        padding-left: 8px;
        font-size: 14px;
        line-height: 14px;
    }

    position: relative;
    display: inline-block;
    font-weight: 400;
    font-size: 0;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
}
</style>