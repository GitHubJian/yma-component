<template>
    <yma-panel>
        <template slot="title">标</template>
        <template> 内容 </template>
        <template slot="footer"> 底部 </template>
    </yma-panel>
</template>

<script>
export default {
    data() {
        return {
            text: '杭州',
            withIcon: '杭州',
            password: 'secret',
            limit: '字数统计',
            locked: '杭州',
            site: 'example',
            area: '多行文本',
        };
    },
    methods: {
        handleChange(value) {
            console.log(value);
        },
    },
};
</script>

<style lang="scss">
html,
body {
    height: 100vh;
    background: #fff;
}

.demo {
    display: flex;
    align-items: center;
}
</style>
