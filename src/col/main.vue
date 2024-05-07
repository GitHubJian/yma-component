<script>
export default {
    name: 'YmaCol',
    props: {
        span: {
            type: Number,
            default: 24,
        },
        tag: {
            type: String,
            default: 'div',
        },
        offset: Number,
        pull: Number,
        push: Number,
    },
    computed: {
        gutter() {
            let parent = this.$parent;
            while (parent && parent.$options.componentName !== 'YmaRow') {
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

        ['span', 'offset', 'pull', 'push'].forEach(prop => {
            if (this[prop] || this[prop] === 0) {
                classList.push(
                    prop !== 'span'
                        ? `yma-col-${prop}-${this[prop]}`
                        : `yma-col-${this[prop]}`
                );
            }
        });

        return h(
            this.tag,
            {
                class: ['yma-col', classList],
                style,
            },
            this.$slots.default
        );
    },
};
</script>

<style lang="scss">
[class*='yma-col-'] {
    float: left;
    box-sizing: border-box;
}

.yma-col-0 {
    display: none;
}

@for $i from 0 through 24 {
    .yma-col-#{$i} {
        width: (calc(1 / 24) * $i * 100) * 1%;
    }

    .yma-col-offset-#{$i} {
        margin-left: (calc(1 / 24) * $i * 100) * 1%;
    }

    .yma-col-pull-#{$i} {
        position: relative;
        right: (calc(1 / 24) * $i * 100) * 1%;
    }

    .yma-col-push-#{$i} {
        position: relative;
        left: (calc(1 / 24) * $i * 100) * 1%;
    }
}
</style>
