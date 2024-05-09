<template>
    <div v-clickoutside="hide" class="yma-dropdown">
        <div ref="triggerEl" :class="{ 'yma-dropdown-trigger': true, 'is-active': visible }">
            <span class="yma-dropdown-trigger__label">{{ label }}</span>
            <yma-icon class="yma-dropdown-trigger__icon" name="arrow_down_s"/>
        </div>
        <slot name="dropdown"></slot>
    </div>
</template>

<script>
import YmaIcon from '../icon';
import clickoutside from '../helper/clickoutside';
import emitter from '../helper/emitter';

function includeIn(aList, bList) {
    return aList.every(a => bList.indexOf(a) > -1);
}

export default {
    name: 'YmaDropdown',
    componentName: 'YmaDropdown',
    mixins: [emitter],
    directives: {clickoutside},
    provide() {
        return {
            dropdown: this,
        };
    },
    components: {
        YmaIcon,
    },
    props: {
        defaultActive: {
            type: Array,
            required: true,
        },
        multiple: {
            type: Boolean,
            default: false,
        },
        label: {
            type: String,
            default: '菜单',
            required: true,
        },
        trigger: {
            type: String,
            default: 'hover',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            timeout: null,
            visible: false,
            triggerEl: null,
            dropdownEl: null,
            innerActive: [],
            allActive: [],
        };
    },
    mounted() {
        this.$on('menu-item-click', this.handleMenuItemClick);

        this.broadcast('YmaDropdownMenuItem', 'triggerActive', [
            this.defaultActive,
        ]);

        this.innerActive = this.defaultActive;
    },
    watch: {
        visible(val) {
            this.broadcast('YmaDropdownMenu', 'visible', val);
            this.$emit('visible-change', val);
        },
        defaultActive(newList) {
            this.broadcast('YmaDropdownMenuItem', 'triggerActive', [newList]);

            this.innerActive = this.defaultActive;
        },
    },
    methods: {
        show() {
            if (this.disabled) {
                return;
            }

            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.visible = true;
            }, 300);
        },
        hide() {
            if (this.disabled) {
                return;
            }

            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.visible = false;
            }, 300);
        },
        handleClick() {
            if (this.disabled) {
                return;
            }

            if (this.visible) {
                this.hide();
            }
            else {
                this.show();
            }
        },
        initEvent() {
            let {trigger, show, hide, handleClick} = this;

            this.triggerEl = this.$refs.triggerEl;

            let dropdownEl = this.dropdownEl;

            if (trigger === 'hover') {
                this.triggerEl.addEventListener('mouseenter', show);
                this.triggerEl.addEventListener('mouseleave', hide);
                dropdownEl.addEventListener('mouseenter', show);
                dropdownEl.addEventListener('mouseleave', hide);
            }
            else if (trigger === 'click') {
                this.triggerEl.addEventListener('click', handleClick);
            }
        },
        handleMenuItemClick(id, isActive) {
            if (id === '-1') {
                if (isActive) {
                    this.innerActive = [...this.allActive, '-1'];
                }
                else {
                    this.innerActive = [];
                }
            }
            else {
                if (isActive) {
                    if (!this.multiple) {
                        this.innerActive = [id];
                    }
                    else {
                        const newInnerActive = Array.from(
                            new Set([...this.innerActive, id])
                        );
                        this.innerActive = newInnerActive;
                    }

                    if (
                        includeIn(
                            this.allActive,
                            Array.from(new Set(this.innerActive))
                        )
                    ) {
                        this.innerActive = [...this.allActive, '-1'];
                    }
                }
                else {
                    this.innerActive = this.innerActive.filter(
                        c => c != id && c != '-1'
                    );
                }
            }

            this.broadcast('YmaDropdownMenuItem', 'triggerActive', [
                this.innerActive,
            ]);

            this.$emit('change', this.innerActive);
        },
        initDomOperation() {
            this.dropdownEl = this.popperEl;

            this.initEvent();
        },
        updateActive(id) {
            if (id !== '-1') {
                this.allActive.push(id);
            }
        },
    },
};
</script>

<style lang="scss">
@import 'yma-csskit/bem.scss';

@include b(dropdown) {
    position: relative;
    display: inline-block;
    height: 28px;
}

@include b(dropdown-trigger) {
    @include e((label, icon)) {
        vertical-align: middle;
    }

    @include e(icon) {
        margin-left: 4px;
    }

    @include when(active) {
        .yma-dropdown-trigger__icon {
            transform: rotate(180deg);
        }
    }

    display: inline-block;
    padding: 2px 6px;
    color: #0d0d0de5;
    font-weight: 600;
    font-size: 14px;
    font-family: PingFang SC;
    line-height: 22px;
    text-align: center;
    cursor: pointer;

    &:hover {
        background: #0d0d0d0f;
    }

    &:active {
        background: #0d0d0d1a;
    }
}
</style>
