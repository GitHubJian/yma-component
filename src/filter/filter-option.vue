<template>
    <li
        class="yma-filter__item"
        :class="{
            'is-selected': itemSelected,
            'is-disabled': disabled,
            'is-hover': isHover,
        }"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        @click.stop="selectOptionClick"
    >
        <span class="yma-filter__item-icon">
            <yma-icon name="symbol_tick"/>
        </span>

        <span v-if="!$slots.default" class="yma-filter__item-label yma-clearfix">
            <span class="yma-pull-left">
                {{ currentLabel }}
            </span>
            <span class="yma-pull-right">
                {{ sublabel }}
            </span>
        </span>
        <span v-else class="yma-filter__item-label">
            <slot></slot>
        </span>
    </li>
</template>

<script>
import YmaIcon from '../icon';
import emitter from '../helper/emitter';
import {getValueByPath} from '../helper/util';

export default {
    name: 'YmaFilterOption',
    componentName: 'YmaFilterOption',
    inject: ['filter'],
    mixins: [emitter],
    components: {
        YmaIcon,
    },
    props: {
        value: {
            required: true,
        },
        label: [String, Number],
        disabled: {
            type: Boolean,
            default: false,
        },
        sublabel: [String, Number],
        indeterminate: Boolean,
    },
    data() {
        return {
            index: -1,
            isSelected: false,
            isHover: false,
        };
    },
    computed: {
        isObject() {
            return (
                Object.prototype.toString.call(this.value).toLowerCase()
                === '[object object]'
            );
        },
        currentLabel() {
            return this.label || (this.isObject ? '' : this.value);
        },
        currentValue() {
            return this.value || this.label || '';
        },
        itemSelected: {
            get() {
                if (!this.filter.multiple) {
                    return this.isEqual(this.value, this.filter.value);
                }

                if (this.filter.checkSelectAll()) {
                    if (this.value == this.filter.allOption.value) {
                        return true;
                    }
                    return false;
                }

                return this.contains(this.filter.value, this.value);
            },
            set() {
                this.selectOptionClick();
            },
        },
    },
    watch: {
        value(newVal, oldVal) {
            const {valueKey} = this.filter;
            if (
                valueKey
                && typeof newVal === 'object'
                && typeof oldVal === 'object'
                && newVal[valueKey] === oldVal[valueKey]
            ) {
                return;
            }

            this.dispatch('YmaFilter', 'setSelected');
        },
    },
    created() {
        this.filter.options.push(this);
        this.filter.cachedOptions.push(this);
        this.filter.optionsCount++;
    },
    beforeDestroy() {
        const {selected, multiple} = this.filter;
        let selectedOptions = multiple ? selected : [selected];
        let index = this.filter.cachedOptions.indexOf(this);
        let selectedIndex = selectedOptions.indexOf(this);

        if (index > -1 && selectedIndex < 0) {
            this.filter.cachedOptions.splice(index, 1);
        }

        this.filter.onOptionDestroy(this.filter.options.indexOf(this));
    },
    methods: {
        isEqual(a, b) {
            if (!this.isObject) {
                return a === b;
            }
            const valueKey = this.filter.valueKey;
            return getValueByPath(a, valueKey) === getValueByPath(b, valueKey);
        },
        contains(arr = [], target) {
            if (!this.isObject) {
                return arr && arr.indexOf(target) > -1;
            }
            const valueKey = this.filter.valueKey;
            return (
                arr
                && arr.some(item => {
                    return (
                        getValueByPath(item, valueKey)
                        === getValueByPath(target, valueKey)
                    );
                })
            );
        },
        handleMouseEnter() {
            if (!this.disabled) {
                this.isHover = true;
            }
        },
        handleMouseLeave() {
            if (!this.disabled) {
                this.isHover = false;
            }
        },
        selectOptionClick() {
            if (this.disabled !== true) {
                this.dispatch('YmaFilter', 'handleOptionClick', [this]);
            }
        },
    },
};
</script>

<style lang="scss">
@import 'yma-csskit/bem.scss';

@include b(filter) {
    @include e(item) {
        @include when(selected) {
            .yma-icon {
                visibility: visible;
            }
        }

        position: relative;
        display: flex;
        gap: 4px;
        overflow: hidden;
        box-sizing: border-box;
        height: 32px;
        padding: 5px 8px;
        border-radius: 6px;
        font-size: 0;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;

        & + & {
            margin-top: 4px;
        }

        &:hover {
            background-color: rgba(13, 13, 13, .06);
        }

        .yma-icon {
            visibility: hidden;
        }
    }

    @include e(item-icon) {
        width: 16px;
        font-size: 14px;
    }

    @include e(item-label) {
        flex: 1;
        color: rgba(13, 13, 13, .9);
        font-size: 14px;
        line-height: 22px;
    }

    @include e(item-sublabel) {
        width: 82px;
    }
}
</style>
