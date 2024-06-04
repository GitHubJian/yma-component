<template>
    <li
        :class="{
            'yma-dropdown-menu__item': true,
            'is-disabled': disabled,
        }"
        @click="handleClick"
    >
        <span class="yma-dropdown-menu__item-icon">
            <yma-icon v-show="isActive" name="symbol_tick"/>
        </span>

        <span class="yma-dropdown-menu__item-label">{{ label }}</span>
    </li>
</template>

<script>
import emitter from '../helper/emitter';

function isNil(val) {
    return val === null || val === undefined;
}

export default {
    name: 'YmaDropdownMenuItem',
    componentName: 'YmaDropdownMenuItem',
    mixins: [emitter],
    inject: ['dropdown'],
    props: {
        label: String,
        id: {
            type: String,
            required: true,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            isActive: false,
        };
    },
    created() {
        this.$on('triggerActive', list => {
            if (list.indexOf(this.allId) > -1) {
                this.isActive = true;
            }
            else {
                if (list.indexOf(this.id) > -1) {
                    this.isActive = true;
                }
                else {
                    this.isActive = false;
                }
            }
        });
    },
    computed: {
        allId() {
            return String(this.dropdown.allId);
        },
    },
    mounted() {
        this.dropdown.updateActive(this.id);
    },
    methods: {
        handleClick() {
            if (this.disabled) {
                return;
            }

            if (!this.dropdown.multiple) {
                this.isActive = true;
            }
            else {
                this.isActive = !this.isActive;
            }

            this.dispatch('YmaDropdown', 'menu-item-click', [
                this.id,
                this.isActive,
            ]);
        },
    },
};
</script>

<style lang="scss">
@import "yma-csskit/bem.scss";

@include b(dropdown-menu) {
    @include e(item) {
        @include when(disabled) {
            opacity: .4;
        }

        height: 32px;
        margin: 0;
        padding: 4px 8px;
        border-radius: 6px;
        color: rgba(13, 13, 13, .9);
        color: #0d0d0de5;
        outline: none;
        list-style: none;
        font-weight: 400;
        font-style: normal;
        font-size: 14px;
        font-family: PingFang SC;
        line-height: 24px;
        letter-spacing: 0;
        text-align: left;
        cursor: pointer;

        &:not(.is-disabled):hover {
            background: rgba(13, 13, 13, .06);
        }

        &:not(.is-disabled):active {
            background: rgba(13, 13, 13, .1);
        }

        & + & {
            margin-top: 4px;
        }
    }

    @include e((item-icon, item-label)) {
        display: inline-block;
        vertical-align: middle;
    }

    @include e(item-icon) {
        width: 16px;
        height: 16px;
        margin-right: 4px;

        .yma-icon {
            vertical-align: unset;
        }
    }
}
</style>
