<template>
    <div class="yma-agreement">
        <yma-checkbox
            v-model="checked" @change="handleChange"
        >同意</yma-checkbox>
        <template v-for="(link, index) in links">
            <yma-link
                class="yma-pl-4"
                underline
                target="_blank"
                :href="link.href"
            >
                {{ link.title }}
            </yma-link>

            <span v-if="index < links.length - 2" class="yma-pl-4">、</span>
            <span v-else-if="index === links.length - 2" class="yma-pl-4">和</span>
        </template>
    </div>
</template>

<script>
import YmaCheckbox from '../checkbox';
import YmaLink from '../link';

export default {
    name: 'YmaAgreement',
    commponents: {
        YmaCheckbox,
        YmaLink,
    },
    props: {
        links: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            checked: false,
        };
    },
    methods: {
        handleChange(value) {
            this.$emit('change', value);
        },
    },
};
</script>

<style lang="scss">
@import 'yma-csskit/bem.scss';

@include b(agreement) {
    display: flex;
    align-items: center;
}
</style>
