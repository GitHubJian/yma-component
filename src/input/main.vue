<template>
    <div
        :class="[
            type === 'textarea' ? 'yma-textarea' : 'yma-input',
            inputSize ? 'yma-input--' + inputSize : '',
            {
                'is-disabled': inputDisabled,
                'is-exceed': inputExceed,
                'is-focus': focused,
                'is-word-limit': isWordLimitVisible,
                'yma-input-group': $slots.prepend || $slots.append,
                'yma-input-group--append': $slots.append,
                'yma-input-group--prepend': $slots.prepend,
                'yma-input--prefix': $slots.prefix || prefixIcon,
                'yma-input--suffix':
                    $slots.suffix ||
                    suffixIcon ||
                    clearable ||
                    showPassword ||
                    isWordLimitVisible,
            },
        ]"
        @mouseenter="hovering = true"
        @mouseleave="hovering = false"
    >
        <template v-if="type !== 'textarea'">
            <div v-if="$slots.prepend" class="yma-input-group__prepend">
                <slot name="prepend"></slot>
            </div>

            <input
                v-bind="$attrs"
                ref="input"
                class="yma-input__inner"
                :type="
                    showPassword
                        ? passwordVisible
                            ? 'text'
                            : 'password'
                        : type
                "
                :disabled="inputDisabled"
                :readonly="readonly"
                :autocomplete="autocomplete"
                @compositionstart="handleCompositionStart"
                @compositionupdate="handleCompositionUpdate"
                @compositionend="handleCompositionEnd"
                @input="handleInput"
                @focus="handleFocus"
                @blur="handleBlur"
                @change="handleChange"
            >

            <span v-if="$slots.prefix || prefixIcon" class="yma-input__prefix">
                <slot name="prefix"></slot>
                <yma-icon
                    v-if="prefixIcon"
                    class="yma-input__icon"
                    :name="prefixIcon"
                />
            </span>

            <span v-if="getSuffixVisible()" class="yma-input__suffix">
                <span class="yma-input__suffix-inner">
                    <template
                        v-if="
                            !showClear || !showPwdVisible || !isWordLimitVisible
                        "
                    >
                        <slot name="suffix"></slot>
                        <yma-icon
                            v-if="suffixIcon"
                            class="yma-input__icon"
                            :name="suffixIcon"
                        />
                    </template>
                    <span
                        v-if="showClear"
                        class="yma-input__icon yma-input__clear"
                        @mousedown.prevent
                        @click="clear"
                    >
                        <yma-icon name="clear_normal"/>
                    </span>
                    <span
                        v-if="showPwdVisible"
                        class="yma-input__icon yma-input__clear yma-input__password"
                        :class="{'is-active': passwordVisible}"
                        @mousedown.prevent
                        @click="handlePasswordVisible"
                    >
                        <yma-icon v-if="!passwordVisible" name="eye"/>
                        <yma-icon v-else name="eye_close"/>
                    </span>
                    <span v-if="isWordLimitVisible" class="yma-input__count">
                        <span class="yma-input__count-inner">
                            {{ textLength }}/{{ upperLimit }}
                        </span>
                    </span>
                </span>
            </span>

            <div v-if="$slots.append" class="yma-input-group__append">
                <slot name="append"></slot>
            </div>
        </template>

        <textarea
            v-else
            v-bind="$attrs"
            ref="textarea"
            class="yma-textarea__inner"
            :disabled="inputDisabled"
            :readonly="readonly"
            :autocomplete="autocomplete"
            :style="textareaStyle"
            @compositionstart="handleCompositionStart"
            @compositionupdate="handleCompositionUpdate"
            @compositionend="handleCompositionEnd"
            @input="handleInput"
            @focus="handleFocus"
            @blur="handleBlur"
            @change="handleChange"
        ></textarea>
        <span
            v-if="isWordLimitVisible && type === 'textarea'"
            class="yma-input__count"
        >
            {{ textLength }}/{{ upperLimit }}
        </span>
    </div>
</template>

<script>
function isKorean(text) {
    const reg = /([(\uAC00-\uD7AF)|(\u3130-\u318F)])+/gi;
    return reg.test(text);
}
import YmaIcon from '../icon';

export default {
    name: 'YmaInput',
    componentName: 'YmaInput',
    inheritAttrs: false,
    components: {
        YmaIcon,
    },
    inject: {
        ymaFormItem: {
            default: null,
        },
    },
    props: {
        value: [String, Number],
        size: String,
        resize: String,
        disabled: Boolean,
        readonly: Boolean,
        type: {
            type: String,
            default: 'text',
        },
        autocomplete: {
            type: String,
            default: 'off',
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
        inputSize() {
            return this.size;
        },
        inputDisabled() {
            return this.disabled;
        },
        nativeInputValue() {
            return this.value === null || this.value === undefined
                ? ''
                : String(this.value);
        },
        showClear() {
            return (
                this.clearable
                && !this.inputDisabled
                && !this.readonly
                && this.nativeInputValue
                && (this.focused || this.hovering)
            );
        },
        showPwdVisible() {
            return (
                this.showPassword
                && !this.inputDisabled
                && !this.readonly
                && (!!this.nativeInputValue || this.focused)
            );
        },
        isWordLimitVisible() {
            return (
                this.showWordLimit
                && this.$attrs.maxlength
                && (this.type === 'text' || this.type === 'textarea')
                && !this.inputDisabled
                && !this.readonly
                && !this.showPassword
            );
        },
        upperLimit() {
            return this.$attrs.maxlength;
        },
        textLength() {
            if (typeof this.value === 'number') {
                return String(this.value).length;
            }

            return (this.value || '').length;
        },
        inputExceed() {
            return this.isWordLimitVisible && this.textLength > this.upperLimit;
        },
        textareaStyle() {
            if (!this.resize) {
                return {};
            }

            return {
                resize: this.resize,
            };
        },
    },
    watch: {
        nativeInputValue() {
            this.setNativeInputValue();
        },
        type() {
            this.$nextTick(() => {
                this.setNativeInputValue();
                this.updateIconOffset();
            });
        },
    },
    methods: {
        focus() {
            this.getInput().focus();
        },
        blur() {
            this.getInput().blur();
        },
        notifyForm(method) {
            const formItem = this.ymaFormItem;
            if (formItem && typeof formItem[method] === 'function') {
                formItem[method]();
            }
        },
        handleBlur(event) {
            this.focused = false;
            this.$emit('blur', event);
            this.notifyForm('onFieldBlur');
        },
        setNativeInputValue() {
            const input = this.getInput();
            if (!input) {
                return;
            }
            if (input.value === this.nativeInputValue) {
                return;
            }
            input.value = this.nativeInputValue;
        },
        handleFocus(event) {
            this.focused = true;
            this.$emit('focus', event);
        },
        handleCompositionStart(event) {
            this.$emit('compositionstart', event);
            this.isComposing = true;
        },
        handleCompositionUpdate(event) {
            this.$emit('compositionupdate', event);
            const text = event.target.value;
            const lastCharacter = text[text.length - 1] || '';
            this.isComposing = !isKorean(lastCharacter);
        },
        handleCompositionEnd(event) {
            this.$emit('compositionend', event);
            if (this.isComposing) {
                this.isComposing = false;
                this.handleInput(event);
            }
        },
        handleInput(event) {
            if (this.isComposing) {
                return;
            }
            if (event.target.value === this.nativeInputValue) {
                return;
            }

            this.$emit('input', event.target.value);
            this.notifyForm('onFieldChange');

            this.$nextTick(this.setNativeInputValue);
        },
        handleChange(event) {
            this.$emit('change', event.target.value);
            this.notifyForm('onFieldChange');
        },
        calcIconOffset(place) {
            const elList = [].slice.call(
                this.$el.querySelectorAll(`.yma-input__${place}`) || []
            );
            if (!elList.length) {
                return;
            }

            let el = null;
            for (let i = 0; i < elList.length; i++) {
                if (elList[i].parentNode === this.$el) {
                    el = elList[i];
                    break;
                }
            }
            if (!el) {
                return;
            }

            const pendantMap = {
                suffix: 'append',
                prefix: 'prepend',
            };
            const pendant = pendantMap[place];
            const group = this.$slots[pendant]
                ? this.$el.querySelector(`.yma-input-group__${pendant}`)
                : null;

            if (group) {
                const offset = group.offsetWidth;
                el.style.transform = `translateX(${place === 'suffix' ? '-' : ''}${offset}px)`;
            }
            else {
                el.style.transform = '';
            }
        },
        updateIconOffset() {
            if (this.type === 'textarea') {
                return;
            }
            this.calcIconOffset('prefix');
            this.calcIconOffset('suffix');
        },
        clear() {
            this.$emit('input', '');
            this.$emit('change', '');
            this.$emit('clear');
            this.notifyForm('onFieldChange');
            this.focus();
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
                this.$slots.suffix
                || this.suffixIcon
                || this.showClear
                || this.showPassword
                || this.isWordLimitVisible
            );
        },
    },
    mounted() {
        this.setNativeInputValue();
        this.updateIconOffset();
    },
    updated() {
        this.$nextTick(this.updateIconOffset);
    },
};
</script>

<style lang="scss">


$--input-height: 32px;
$--input-font-size: 14px;
$--input-border: 1px solid rgba(13, 13, 13, .12);
$--input-radius: 6px;
$--input-color: #0d0d0de5;
$--input-placeholder: #0d0d0d75;
$--input-icon: rgba(13, 13, 13, .46);
$--input-hover: rgba(13, 13, 13, .24);
$--input-focus: rgba(31, 105, 224, 1);
$--input-danger: rgba(221, 51, 50, 1);
$--input-disabled-bg: rgba(13, 13, 13, .06);
$--input-disabled-color: rgba(13, 13, 13, .46);

@import 'yma-csskit/bem.scss';

@mixin input-placeholder {
    &::placeholder {
        color: $--input-placeholder;
    }
}

@include b(textarea) {
    @include e(inner) {
        @include input-placeholder;

        display: block;
        box-sizing: border-box;
        width: 100%;
        min-height: 64px;
        padding: 5px 12px;
        border: $--input-border;
        border-radius: $--input-radius;
        background-color: #fff;
        background-image: none;
        color: $--input-color;
        outline: none;
        font-size: inherit;
        font-family: inherit;
        line-height: 1.5;
        resize: vertical;
        transition: border-color .2s;

        &:hover {
            border-color: $--input-hover;
        }

        &:focus {
            border-color: $--input-focus;
        }
    }

    @include when(disabled) {
        .yma-textarea__inner {
            @include input-placeholder;

            border-color: rgba(13, 13, 13, .12);
            background-color: $--input-disabled-bg;
            color: $--input-disabled-color;
            cursor: not-allowed;
        }

        .yma-input__count {
            background-color: $--input-disabled-bg;
        }
    }

    @include when(exceed) {
        .yma-textarea__inner {
            border-color: $--input-danger;
        }

        .yma-input__count {
            color: $--input-danger;
        }
    }

    @include when(word-limit) {
        .yma-textarea__inner {
            padding-bottom: 22px;
        }

        .yma-input__count {
            right: 16px;
        }
    }

    position: relative;
    display: inline-block;
    vertical-align: bottom;
    width: 100%;
    font-size: $--input-font-size;

    .yma-input__count {
        position: absolute;
        right: 10px;
        bottom: 6px;
        background: #fff;
        color: $--input-placeholder;
        font-size: 12px;
        line-height: 16px;
    }
}

@include b(input) {
    @include e(inner) {
        @include input-placeholder;

        display: inline-block;
        box-sizing: border-box;
        width: 100%;
        height: $--input-height;
        padding: 0 12px;
        border: $--input-border;
        border-radius: $--input-radius;
        background-color: #fff;
        background-image: none;
        color: $--input-color;
        outline: none;
        font-size: inherit;
        font-family: inherit;
        line-height: $--input-height;
        transition: border-color .2s;
        appearance: none;

        &::-ms-reveal,
        &::-ms-clear {
            display: none;
        }

        &:hover {
            border-color: $--input-hover;
        }

        &:focus {
            border-color: $--input-focus;
        }
    }

    @include e(prefix) {
        left: 8px;
    }

    @include e(suffix) {
        right: 8px;
        pointer-events: none;
    }

    @include e((prefix, suffix)) {
        position: absolute;
        top: 0;
        display: flex;
        align-items: center;
        height: 100%;
        color: $--input-icon;
        transition: all .2s;
    }

    @include e(suffix-inner) {
        display: inline-flex;
        gap: 4px;
        align-items: center;
        height: 100%;
        pointer-events: all;
    }

    @include e(icon) {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        color: $--input-icon;
        font-size: 0;
        line-height: 1;
    }

    @include e(svg) {
        display: block;
        width: 16px;
        height: 16px;
    }

    @include when(disabled) {
        .yma-input__inner {
            @include input-placeholder;

            border-color: rgba(13, 13, 13, .12);
            background-color: $--input-disabled-bg;
            color: $--input-disabled-color;
            cursor: not-allowed;

            &:hover,
            &:focus {
                border-color: rgba(13, 13, 13, .12);
            }
        }

        .yma-input__icon {
            cursor: not-allowed;
        }

        .yma-input__count-inner {
            background: $--input-disabled-bg;
        }
    }

    @include when(exceed) {
        .yma-input__inner {
            border-color: $--input-danger;

            &:focus {
                border-color: $--input-danger;
            }
        }

        .yma-input__count {
            color: $--input-danger;
        }
    }

    @include when(word-limit) {
        .yma-input__inner {
            padding-right: 54px;
        }
    }

    @include m(suffix) {
        .yma-input__inner {
            padding-right: 32px;
        }
    }

    @include m(prefix) {
        .yma-input__inner {
            padding-left: 32px;
        }
    }

    @include m(medium) {
        @include e(inner) {
            height: 36px;
            line-height: 36px;
        }

        font-size: 14px;
    }

    @include m(small) {
        @include e(inner) {
            height: 28px;
            line-height: 28px;
        }

        font-size: 13px;
    }

    @include m(mini) {
        @include e(inner) {
            height: 24px;
            line-height: 24px;
        }

        font-size: 12px;
    }

    position: relative;
    display: inline-block;
    width: 100%;
    font-size: $--input-font-size;

    .yma-input__clear {
        color: $--input-icon;
        cursor: pointer;

        &:hover {
            color: rgba(13, 13, 13, .66);
        }
    }

    .yma-input__password.is-active {
        color: $--input-focus;
    }

    .yma-input__count {
        display: inline-flex;
        align-items: center;
        height: 100%;
        color: $--input-placeholder;
        font-size: 12px;

        .yma-input__count-inner {
            display: inline-block;
            padding-left: 4px;
            background: #fff;
            line-height: initial;
        }
    }
}

@include b(input-group) {
    @include e((append, prepend)) {
        position: relative;
        display: table-cell;
        vertical-align: middle;
        width: 1px;
        padding: 0 12px;
        border: $--input-border;
        border-radius: $--input-radius;
        background-color: rgba(13, 13, 13, .06);
        color: rgba(13, 13, 13, .66);
        white-space: nowrap;

        &:focus {
            outline: none;
        }
    }

    @include e(prepend) {
        border-right: 0;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }

    @include e(append) {
        border-left: 0;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }

    @include m(prepend) {
        .yma-input__inner {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }
    }

    @include m(append) {
        .yma-input__inner {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }
    }

    display: inline-table;
    width: 100%;
    border-spacing: 0;
    border-collapse: separate;
    line-height: normal;

    > .yma-input__inner {
        display: table-cell;
        vertical-align: middle;
    }
}

.yma-form-item.is-error {
    .yma-input__inner,
    .yma-textarea__inner {
        border-color: $--input-danger;

        &:hover,
        &:focus {
            border-color: $--input-danger;
        }
    }
}
</style>
