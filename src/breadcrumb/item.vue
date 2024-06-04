<template>
    <span class="yma-breadcrumb__item" @click="clickHandler">
        <span
            ref="link"
            :class="['yma-breadcrumb__inner', link ? 'is-link' : '']"
        >
            <slot></slot>
        </span>
        <i
            v-if="separatorClass"
            class="yma-breadcrumb__separator"
            :class="separatorClass"
        ></i>
        <span
            v-else class="yma-breadcrumb__separator"
            role="presentation"
        >{{
            separator
        }}</span>
    </span>
</template>
<script>
export default {
    name: 'YmaBreadcrumbItem',
    inject: ['ymaBreadcrumb'],
    props: {
        link: Boolean,
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
    },
    methods: {
        clickHandler(e) {
            this.$emit('click', e);
        },
    },
};
</script>
