<script>
export default {
    name: 'YmaRow',
    componentName: 'YmaRow',
    props: {
        tag: {
            type: String,
            default: 'div',
        },
        gutter: Number,
    },
    computed: {
        style() {
            const ret = {};

            if (this.gutter) {
                ret.marginLeft = `-${this.gutter / 2}px`;
                ret.marginRight = ret.marginLeft;
            }

            return ret;
        },
    },
    render(h) {
        return h(
            this.tag,
            {
                class: ['yma-row'],
                style: this.style,
            },
            this.$slots.default
        );
    },
};
</script>

<style lang="scss">
@import 'yma-csskit/bem.scss';

@include b(row) {
    position: relative;
    box-sizing: border-box;

    &::after {
        content: '';
        display: table;
        clear: both;
    }
}
</style>
