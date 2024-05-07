<template>
    <div :class="{
        'yma-menu__item': true,
        'is-active': active,
    }" @click="handleClick">
        <div class="yma-menu__inner">
            <span class="yma-menu__icon">
                <yma-icon :name="icon"></yma-icon>
            </span>
            <span class="yma-menu__title">{{ title }}</span>
        </div>
    </div>
</template>

<script>
import emitter from '../helper/emitter';
import mixin from './mixin'
import YmaIcon from '../icon'

export default {
    name: 'YmaMenuItem',
    componentName: "YmaMenuItem",
    components: {
        YmaIcon
    },
    mixins: [emitter, mixin],
    props: {
        index: {
            default: null,
            validator: val => typeof val === 'string' || val === null
        },
        disabled: Boolean,
        icon: {
            type: String
        },
        title: {
            type: String,
            required: true
        }
    },
    computed: {
        active () {
            return this.index === this.rootMenu.activeIndex
        },
    },
    methods: {
        handleClick () {
            if (!this.disabled) {
                this.dispatch('YmaMenu', 'item-click', this);
                this.$emit('click', this);
            }
        }
    },
    mounted () {
        this.parentMenu.addItem(this);
        this.rootMenu.addItem(this);
    },
    beforeDestroy () {
        this.parentMenu.removeItem(this);
        this.rootMenu.removeItem(this);
    }
};
</script>

<style lang="scss">
@import "yma-csskit/bem.scss";

@include b((menu)) {
    @include e(item) {
        height: 36px;
        padding: 10px 4px 10px 22px;
        color: var(---kd-color-text-primary, #0d0d0de5);
        font-weight: 400;
        font-size: 14px;
        font-family: PingFang SC;
        text-align: left;
        line-height: 14px;
        box-sizing: border-box;
        cursor: pointer;

        @include when(active) {
            border-radius: 4px;
            background-color: #3B64FC26;
            font-weight: 600;
            color: #3B64FC;
        }

        &+& {
            margin-top: 4px;
        }


        &+.yma-submenu {
            margin-top: 4px;
        }

        .yma-submenu+& {
            margin-top: 4px;
        }
    }

    @include e((toggle, icon, title)) {
        display: inline-block;
        vertical-align: middle;
    }

    @include e((toggle, icon)) {
        width: 16px;
        height: 16px;
        font-size: 0;
    }

    @include e(toggle) {
        margin-right: 2px;
    }

    @include e(icon) {
        margin-right: 8px;
    }
}
</style>
