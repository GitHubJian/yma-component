<template>
    <div
        v-clickoutside="handleClose"
        :class="['yma-filter']"
        @click.stop="toggleMenu"
    >
        <span class="yma-filter__trigger">
            <span
                :class="{
                    'yma-filter__trigger-label': true,
                    'is-not-all': isNotAll,
                }"
            >
                <span :style="{color: fillColor}">{{ title }}</span>
                <yma-icon
                    v-show="visible" class="yma-ml-4"
                    name="arrow_up_s"
                />
                <yma-icon
                    v-show="!visible"
                    class="yma-ml-4"
                    name="arrow_down_s"
                />
            </span>
        </span>

        <filter-dropdown v-show="visible">
            <filter-option
                v-if="multiple"
                :value="allOption.value"
                :label="allOption.label"
            />
            <slot></slot>
        </filter-dropdown>
    </div>
</template>

<script>
import {valueEquals, getValueByPath} from '../helper/util.js';
import emitter from '../helper/emitter.js';
import clickoutside from '../helper/clickoutside.js';
import FilterDropdown from './filter-dropdown.vue';
import FilterOption from './filter-option.vue';
import YmaIcon from '../icon';

const ActiveColor = 'rgba(30,95,199,1)';
const DefaultColor = 'rgba(13,13,13,0.9)';

export default {
    name: 'YmaFilter',
    componentName: 'YmaFilter',
    mixins: [emitter],
    directives: {
        clickoutside,
    },
    components: {
        FilterDropdown,
        FilterOption,
        YmaIcon,
    },
    provide() {
        return {
            filter: this,
        };
    },
    props: {
        value: {
            required: true,
        },
        disabled: Boolean,
        multiple: Boolean,
        valueKey: {
            type: String,
            default: 'value',
        },
        dropdownWidth: {
            type: String,
            default: 'auto',
        },
    },
    data() {
        return {
            title: '全部选择',
            fillColor: DefaultColor,
            isNotAll: false,
            options: [],
            cachedOptions: [],
            selected: this.multiple ? [] : {},
            optionsCount: 0,
            visible: false,
            allOption: {
                label: '全部',
                value: -1,
            },
        };
    },
    watch: {
        value() {
            this.setSelected();
        },
        visible(val) {
            if (!val) {
                this.broadcast('YmaFilterDropdown', 'destroyPopper');
            }
            else {
                this.broadcast('YmaFilterDropdown', 'updatePopper');
            }

            this.$emit('visible-change', val);
        },
        isAllSeleted() {},
    },
    created() {
        if (this.multiple && !Array.isArray(this.value)) {
            this.$emit('input', []);
        }

        if (!this.multiple && Array.isArray(this.value)) {
            this.$emit('input', '');
        }

        this.$on('handleOptionClick', this.handleOptionSelect);
        this.$on('setSelected', this.setSelected);
    },
    mounted() {
        this.setSelected();
    },
    methods: {
        checkSelectAll() {
            if (this.multiple) {
                return this.value.indexOf(this.allOption.value) > -1;
            }
            return false;
        },
        updateTitle(val) {
            const that = this;
            setTimeout(() => {
                if (that.isSelectedAll(val)) {
                    that.title = '全部类型';
                    that.fillColor = DefaultColor;
                    that.isNotAll = false;
                }
                else {
                    that.title = `已筛选 ${val.length} 个类型`;
                    that.fillColor = ActiveColor;
                    that.isNotAll = true;
                }
            }, 1);
        },
        emitChange(val) {
            if (!valueEquals(this.value, val)) {
                this.updateTitle(val);

                this.$emit('change', val);
            }
        },
        getOption(value) {
            let option;
            const isObject
                = Object.prototype.toString.call(value).toLowerCase()
                    === '[object object]';
            const isNull
                = Object.prototype.toString.call(value).toLowerCase()
                    === '[object null]';
            const isUndefined
                = Object.prototype.toString.call(value).toLowerCase()
                    === '[object undefined]';

            for (let i = this.cachedOptions.length - 1; i >= 0; i--) {
                const cachedOption = this.cachedOptions[i];
                const isEqual = isObject
                    ? getValueByPath(cachedOption.value, this.valueKey)
                        === getValueByPath(value, this.valueKey)
                    : cachedOption.value === value;
                if (isEqual) {
                    option = cachedOption;
                    break;
                }
            }
            if (option) {
                return option;
            }

            const label
                = !isObject && !isNull && !isUndefined ? String(value) : '';
            let newOption = {
                value: value,
                currentLabel: label,
            };
            if (this.multiple) {
                newOption.hitState = false;
            }

            return newOption;
        },
        setSelected() {
            if (!this.multiple) {
                let option = this.getOption(this.value);
                this.selected = option;

                return;
            }

            let result = [];
            if (Array.isArray(this.value)) {
                this.value.forEach(value => {
                    result.push(this.getOption(value));
                });
            }

            this.updateTitle(this.value);
            this.selected = result;
        },
        handleClose() {
            this.visible = false;
        },
        handleOptionSelect(option) {
            const {allOption} = this;

            if (this.multiple) {
                let value;
                if (option.value === allOption.value) {
                    value = (this.value || []).slice();
                    const optionIndex = this.getValueIndex(value, option.value);
                    if (optionIndex > -1) {
                        // 移除【全部】选择
                        value = [];
                    }
                    else {
                        value = [];
                        this.options.forEach(function (option) {
                            value.push(option.value);
                        });
                    }
                }
                else {
                    value = (this.value || []).slice();
                    const optionIndex = this.getValueIndex(value, option.value);
                    if (this.checkSelectAll()) {
                        value = [option.value];
                    }
                    else {
                        if (optionIndex > -1) {
                            value.splice(optionIndex, 1);

                            if (value.length == 0) {
                                value = this.cachedOptions.map(function (item) {
                                    return item.value;
                                });
                            }
                        }
                        else {
                            value.push(option.value);

                            if (
                                this.isSelectedAll([
                                    ...value,
                                    this.allOption.value,
                                ])
                            ) {
                                value.push(this.allOption.value);
                            }
                        }
                    }
                }

                this.$emit('input', value);
                this.emitChange(value);
            }
            else {
                this.$emit('input', option.value);
                this.emitChange(option.value);
                this.visible = false;
            }
        },
        getValueIndex(arr = [], value) {
            const isObject
                = Object.prototype.toString.call(value).toLowerCase()
                    === '[object object]';
            if (!isObject) {
                return arr.indexOf(value);
            }
            const valueKey = this.valueKey;
            let index = -1;
            arr.some((item, i) => {
                if (
                    getValueByPath(item, valueKey)
                    === getValueByPath(value, valueKey)
                ) {
                    index = i;
                    return true;
                }
                return false;
            });

            return index;
        },
        toggleMenu() {
            this.visible = !this.visible;
        },
        onOptionDestroy(index) {
            if (index > -1) {
                this.optionsCount--;
                this.options.splice(index, 1);
            }
        },
        isSelectedAll(value) {
            const list = Array.from(new Set(value)).sort();
            let optionsValue = this.options.map(function (item) {
                return item.value;
            });
            optionsValue = Array.from(new Set(optionsValue)).sort();
            if (optionsValue.length == 0) {
                return false;
            }

            if (list.length === optionsValue.length) {
                for (let i = 0; i < list.length; i++) {
                    const val = list[i];
                    if (optionsValue.indexOf(val) > -1) {
                        continue;
                    }
                    else {
                        return false;
                    }
                }

                return true;
            }
            else if (list.length < optionsValue.length) {
                if (
                    list.length == 1
                    && list.indexOf(this.allOption.value) > -1
                ) {
                    return true;
                }

                return false;
            }

            console.error('YMA Filter isSelectedAll throw error');
        },
    },
};
</script>

<style lang="scss">
@import 'yma-csskit/bem.scss';

@include b(filter) {
    @include e(trigger) {
        display: inline-block;
        height: 20px;
        padding-right: 4px;
        padding-left: 6px;
        border-radius: 4px;
        cursor: pointer;

        &:hover {
            background: rgba(13, 13, 13, .06);
        }

        &:active {
            background: rgba(13, 13, 13, .12);
        }
    }

    @include e(trigger-label) {
        display: inline-block;
        font-size: 0;
        text-align: center;

        &.is-not-all {
            font-weight: 500;
        }

        & > span,
        & > i {
            vertical-align: middle;
            font-size: 14px;
            line-height: 20px;
        }
    }

    @include e((trigger-label, trigger-icon)) {
        vertical-align: middle;
    }

    @include e(trigger-icon) {
        margin-left: 4px;
    }

    position: relative;
    display: inline-block;
    font-size: 0;
    user-select: none;
}
</style>
