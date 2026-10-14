<script>
export default {
    name: 'YmaGrid',
    componentName: 'YmaGrid',
    props: {
        tag: {
            type: String,
            default: 'div',
        },
        quickly: {
            type: String,
            default: '',
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
                class: ['yma-grid', this.quickly && 'yma-grid-' + this.quickly],
                style: this.style,
            },
            this.$slots.default
        );
    },
};
</script>

<style lang="scss">
@import "yma-csskit/bem.scss";

@include b(grid) {
    @for $i from 1 through 6 {
        &.yma-grid-#{$i} {
            & > * {
                flex: 0 0 auto;
                width: (calc(1 / $i) * 100) * 1%;
            }
        }
    }

    display: flex;
    flex-wrap: wrap;

    & > * {
        flex-shrink: 0;
        box-sizing: border-box;
        width: 100%;
        max-width: 100%;
    }

    &.yma-grid-auto {
        & > * {
            flex: 0 0 auto;
            width: auto;
        }
    }
}
</style>
