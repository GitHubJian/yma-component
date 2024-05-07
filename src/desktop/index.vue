<template>
    <yma-container class="yma-desktop" :gap="verticalGap">
        <yma-header :height="header">
            <slot name="header"></slot>
        </yma-header>

        <yma-container :gap="horizontalGap">
            <yma-aside :width="aside">
                <slot name="aside"></slot>
            </yma-aside>

            <yma-main>
                <slot></slot>
            </yma-main>
        </yma-container>
    </yma-container>
</template>


<script>
import YmaContainer from './container.vue';
import YmaHeader from './header.vue';
import YmaAside from './aside.vue';
import YmaMain from './main.vue';
import YmaFooter from './footer.vue';

export default {
    name: 'YmaDesktop',
    components: {
        YmaContainer,
        YmaHeader,
        YmaAside,
        YmaMain,
        YmaFooter,
    },
    props: {
        header: {
            type: String,
            default: '60px',
        },
        aside: {
            type: String,
            default: '300px',
        },
        footer: {
            type: String,
            default: '60px',
        },
        verticalGap: {
            type: String,
            default: '0px',
        },
        horizontalGap: {
            type: String,
            default: '0px',
        },
    },
};
</script>

<style lang="scss">
@import "yma-csskit/bem.scss";

body {
    width: 100%;
    height: 100%;
}

.yma-desktop {
    height: 100%;
    overflow: hidden;
}

.yma-content {
    height: 100%;
}
</style>