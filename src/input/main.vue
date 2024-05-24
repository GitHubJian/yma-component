<template>
    <div
        :class="[
            'yma-input',
            {
                'is-disabled': inputDisabled,
                'yma-input--prefix': $slots.prefix || prefixIcon,
                'yma-input--suffix':
                    $slots.suffix || suffixIcon || clearable || showPassword,
            },
        ]"
        @mouseenter="hovering = true"
        @mouseleave="hovering = false"
    >
        <input
            class="yma-input__inner"
            v-bind="$attrs"
            :type="
                showPassword ? (passwordVisible ? 'text' : 'password') : type
            "
            :disabled="inputDisabled"
            :readonly="readonly"
            ref="input"
            @compositionstart="handleCompositionStart"
            @compositionupdate="handleCompositionUpdate"
            @compositionend="handleCompositionEnd"
            @input="handleInput"
            @focus="handleFocus"
            @blur="handleBlur"
            @change="handleChange"
        />

        <span class="yma-input__prefix" v-if="$slots.prefix || prefixIcon">
            <slot name="prefix"></slot>
            <yma-icon
                v-if="prefixIcon"
                class="el-input__icon"
                name="prefixIcon"
            ></yma-icon>
        </span>

        <span v-if="getSuffixVisible()" class="yma-input__suffix">
            <span class="yma-input__suffix-inner">
                <template
                    v-if="!showClear || !showPwdVisible || !isWordLimitVisible"
                >
                    <slot name="suffix"></slot>
                    <yma-icon
                        v-if="suffixIcon"
                        class="el-input__icon"
                        name="suffixIcon"
                    ></yma-icon>
                </template>
                <yma-icon
                    v-if="showClear"
                    class="yma-input__icon yma-icon-circle-close yma-input__clear"
                    @mousedown.prevent
                    @click="clear"
                ></yma-icon>

                <yma-icon
                    v-if="showPwdVisible"
                    class="yma-input__icon yma-icon-view yma-input__clear"
                    @mousedown.prevent
                    @click="clear"
                ></yma-icon>

                <span v-if="isWordLimitVisible" class="yma-input__count">
                    <span class="yma-input__count-inner">
                        {{ textLength }}/{{ upperLimit }}
                    </span>
                </span>
            </span>
        </span>
    </div>
</template>

<script>
export default {
    name: "YmaInput",
    componentName: "YmaInput",
    props: {
        value: [String, Number],
        disabled: Boolean,
        readonly: Boolean,
        type: {
            type: String,
            default: "text",
        },
        suffixIcon: String,
        prefixIcon: String,
        clearable: {
            type: Boolean,
            default: false,
        },
        showPassword: {
            type: Boolean,
            default: false,
        },
        showWordLimit: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            hovering: false,
            focused: false,
            isComposing: false,
            passwordVisible: false,
        };
    },
    computed: {
        inputDisabled() {
            return this.disabled;
        },
        nativeInputValue() {
            return this.value === null || this.value === undefined
                ? ""
                : String(this.value);
        },
        showClear() {
            return (
                this.clearable &&
                !this.inputDisabled &&
                !this.readonly &&
                this.nativeInputValue &&
                (this.focused || this.hovering)
            );
        },
        showPwdVisible() {
            return (
                this.showPassword &&
                !this.inputDisabled &&
                !this.readonly &&
                (!!this.nativeInputValue || this.focused)
            );
        },
        isWordLimitVisible() {
            return (
                this.showWordLimit &&
                this.$attrs.maxlength &&
                this.type === "text" &&
                !this.inputDisabled &&
                !this.readonly &&
                !this.showPassword
            );
        },
        upperLimit() {
            return this.$attrs.maxlength;
        },
        textLength() {
            if (typeof this.value === "number") {
                return String(this.value).length;
            }

            return (this.value || "").length;
        },
        inputExceed() {
            return this.isWordLimitVisible && this.textLength > this.upperLimit;
        },
    },
    watch: {
        nativeInputValue() {
            this.setNativeInputValue();
        },
    },
    methods: {
        focus() {
            this.getInput().focus();
        },
        blur() {
            this.getInput().blur();
        },
        handleBlur(event) {
            this.focused = false;
            this.$emit("blur", event);
        },
        setNativeInputValue() {
            const input = this.getInput();
            if (!input) return;
            if (input.value === this.nativeInputValue) return;
            input.value = this.nativeInputValue;
        },
        handleFocus(event) {
            this.focused = true;
            this.$emit("focus", event);
        },
        handleCompositionStart(event) {
            this.$emit("compositionstart", event);
            this.isComposing = true;
        },
        handleCompositionUpdate(event) {
            this.$emit("compositionupdate", event);
            const text = event.target.value;
            const lastCharacter = text[text.length - 1] || "";
            this.isComposing = !isKorean(lastCharacter);
        },
        handleCompositionEnd(event) {
            this.$emit("compositionend", event);
            if (this.isComposing) {
                this.isComposing = false;
                this.handleInput(event);
            }
        },
        handleInput(event) {
            if (this.isComposing) return;
            if (event.target.value === this.nativeInputValue) return;

            this.$emit("input", event.target.value);

            this.$nextTick(this.setNativeInputValue);
        },
        handleChange(event) {
            this.$emit("change", event.target.value);
        },
        clear() {
            this.$emit("input", "");
            this.$emit("change", "");
            this.$emit("clear");
        },
        handlePasswordVisible() {
            this.passwordVisible = !this.passwordVisible;
            this.$nextTick(() => {
                this.focus();
            });
        },
        getInput() {
            return this.$refs.input || this.$refs.textarea;
        },
        getSuffixVisible() {
            return (
                this.$slots.suffix ||
                this.suffixIcon ||
                this.showClear ||
                this.showPassword ||
                this.isWordLimitVisible
            );
        },
    },
    mounted() {
        this.setNativeInputValue();
    },
};
</script>