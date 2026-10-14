<template>
    <hm-center class="hm-empty" align="center">
        <div class="hm-empty__inner">
            <yma-icon name="blank_contents_empty"/>

            <p class="hm-empty__text">{{ text }}</p>
        </div>
    </hm-center>
</template>

<script>
export default {
    name: 'HmEmpty',
    props: {
        text: {
            type: String,
            default() {
                return '暂无内容';
            },
        },
    },
    data() {
        return {};
    },
};
</script>

<style lang="scss">
@import '@/lib/util/bem.scss';

@include b(empty) {
    @include e(inner) {
        text-align: center;
    }

    @include e(text) {
        margin-top: 8px;
        color: #666;
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
        text-align: center;
    }
}
</style>
