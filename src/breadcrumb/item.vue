<template>
    <span class="yma-breadcrumb__item">
        <span ref="link" :class="['yma-breadcrumb__inner', to ? 'is-link' : '']">
            <slot></slot>
        </span>
        <i
            v-if="separatorClass" class="yma-breadcrumb__separator"
            :class="separatorClass"
        ></i>
        <span
            v-else class="yma-breadcrumb__separator"
            role="presentation"
        >{{ separator }}</span>
    </span>
</template>
<script>
export default {
    name: 'YmaBreadcrumbItem',
    inject: ['ymaBreadcrumb'],
    props: {
        to: {},
        replace: Boolean,
    },
    data() {
        return {
            separator: '',
            separatorClass: '',
        };
    },
    mounted() {
        this.separator = this.ymaBreadcrumb.separator;
        this.separatorClass = this.ymaBreadcrumb.separatorClass;
        const link = this.$refs.link;
        link.addEventListener('click', _ => {
            const {to, $router} = this;
            if (!to || !$router) {
                return;
            }
            this.replace ? $router.replace(to) : $router.push(to);
        });
    },
};
</script>
