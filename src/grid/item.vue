<script>
export default {
    name: 'YmaGridItem',
    props: {
        span: {
            type: [Number, String],
            default: '',
        },
        tag: {
            type: String,
            default: 'div',
        },
        offset: Number,
    },
    computed: {
        gutter() {
            let parent = this.$parent;
            while (parent && parent.$options.componentName !== 'YmaGrid') {
                parent = parent.$parent;
            }

            return parent ? parent.gutter : 0;
        },
    },
    render(h) {
        let classList = [];
        let style = {};

        if (this.gutter) {
            style.paddingLeft = this.gutter / 2 + 'px';
            style.paddingRight = style.paddingLeft;
        }

        ['span', 'offset'].forEach(prop => {
            if (this[prop] || this[prop] === 0) {
                classList.push(
                    prop !== 'span'
                        ? `yma-grid-item-${prop}-${this[prop]}`
                        : `yma-grid-item-${this[prop]}`
                );
            }
        });

        return h(
            this.tag,
            {
                class: ['yma-grid-item', classList],
                style,
            },
            this.$slots.default
        );
    },
};
</script>

<style lang="scss">
@import "yma-csskit/bem.scss";

@include b(grid-item) {
    @for $i from 0 through 24 {
        &.yma-grid-item-#{$i} {
            flex: 0 0 auto;
            width: (calc(1 / 24) * $i * 100) * 1%;
        }

        &.yma-grid-item-offset-#{$i} {
            margin-left: (calc(1 / 24) * $i * 100) * 1%;
        }
    }

    flex: 1 0 0%;

    &.yma-grid-item-auto {
        flex: 0 0 auto;
        width: auto;
    }
}
</style>
