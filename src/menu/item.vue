<template>
    <div
        :class="{
            'yma-menu__item': true,
            'is-active': active,
        }"
        @click="handleClick"
    >
        <div class="yma-menu__inner">
            <span class="yma-menu__icon">
                <yma-icon v-if="active" :name="icon + '-active'"/>
                <yma-icon v-else :name="icon"/>
            </span>
            <span class="yma-menu__title">{{ title }}</span>
        </div>
    </div>
</template>

<script>
import emitter from '../helper/emitter';
import mixin from './mixin';
import YmaIcon from '../icon';

export default {
    name: 'YmaMenuItem',
    componentName: 'YmaMenuItem',
    components: {
        YmaIcon,
    },
    mixins: [emitter, mixin],
    props: {
        index: {
            default: null,
            validator: val => typeof val === 'string' || val === null,
        },
        disabled: Boolean,
        icon: {
            type: String,
        },
        title: {
            type: String,
            required: true,
        },
    },
    computed: {
        active() {
            return this.index === this.rootMenu.activeIndex;
        },
    },
    methods: {
        handleClick() {
            if (!this.disabled) {
                this.dispatch('YmaMenu', 'item-click', this);
                this.$emit('click', this);
            }
        },
    },
    mounted() {
        this.parentMenu.addItem(this);
        this.rootMenu.addItem(this);
    },
    beforeDestroy() {
        this.parentMenu.removeItem(this);
        this.rootMenu.removeItem(this);
    },
};
</script>

<style lang="scss">
@import "yma-csskit/bem.scss";

@include b((menu)) {
    @include e(item) {
        @include when(active) {
            border-radius: 4px;
            background-color: #3b64fc26;
            color: #3b64fc;
            font-weight: 600;
        }

        box-sizing: border-box;
        height: 36px;
        padding: 10px 4px 10px 22px;
        color: #0d0d0de5;
        font-weight: 400;
        font-size: 14px;
        font-family: PingFang SC;
        line-height: 14px;
        text-align: left;
        cursor: pointer;

        &:hover {
            border-radius: 4px;
            background-color: rgba(59, 100, 252, .1);
        }

        & + & {
            margin-top: 4px;
        }

        & + .yma-submenu {
            margin-top: 4px;
        }

        .yma-submenu + & {
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
