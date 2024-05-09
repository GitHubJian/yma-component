<template>
    <div class="yma-list">


        <div class="yma-list__body">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'YmaList',
};
</script>

<style lang="scss">
@import "yma-csskit/bem.scss";

@include b(list) {

}
</style>
