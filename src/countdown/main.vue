<template>
    <span
        class="yma-countdown"
        :class="{
            'is-disabled': currentDisabled,
        }"
        @click.stop="handleClick"
    >
        {{ text }}
    </span>
</template>

<script>
export default {
    name: 'YmaCountdown',
    props: {
        disabled: {
            type: Boolean,
            default: false,
        },
        count: {
            type: Number,
            default: 60,
        },
        handler: {
            type: Function,
            default: function () {},
        },
    },
    data() {
        return {
            num: 0,
            lock: false,
            text: '发送验证码',
        };
    },
    watch: {
        count(newVal) {
            this.num = newVal;
        },
    },
    computed: {
        currentDisabled() {
            if (this.disabled) {
                return true;
            }

            if (this.lock) {
                return true;
            }

            return false;
        },
    },
    mounted() {
        this.num = this.count;
    },
    methods: {
        handleClick() {
            if (this.disabled) {
                return;
            }

            if (this.lock) {
                return;
            }

            this.handler((err, data) => {
                if (!err) {
                    this.lock = true;
                    this.text = `${this.num}s后重发`;

                    this.timer = window.setInterval(() => {
                        if (this.num === 0) {
                            window.clearInterval(this.timer);
                            this.timer = null;
                            this.lock = false;
                            this.text = '发送验证码';
                            this.num = this.count;
                        }
                        else {
                            this.num--;
                            this.text = `${this.num}s后重发`;
                        }
                    }, 1e3);
                }
            });
        },
        reset() {
            this.disabled = false;
            this.lock = false;
            this.num = this.count;

            window.clearInterval(this.timer);
            this.timer = null;
            this.text = '发送验证码';
        },
    },
};
</script>

<style lang="scss">
@import "yma-csskit/bem.scss";

@include b(countdown) {
    @include when(disabled) {
        opacity: .4;
    }

    color: var(---, #3b64fc);
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    line-height: 22px;
    cursor: pointer;
}
</style>
