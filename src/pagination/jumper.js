import YmaInput from '../input';

export default {
    name: 'YmaJumper',
    components: {
        YmaInput,
    },
    data() {
        return {
            userInput: null,
        };
    },
    watch: {
        '$parent.internalCurrentPage'() {
            this.userInput = null;
        },
    },
    methods: {
        handleKeyup({keyCode, target}) {
            if (keyCode === 13) {
                this.handleChange(target.value);
            }
        },
        handleInput(value) {
            this.userInput = value;
        },
        handleChange(value) {
            this.$parent.internalCurrentPage = this.$parent.getValidCurrentPage(value);
            this.$parent.emitChange();
            this.userInput = null;
        },
    },
    render(h) {
        return (
            <span class='yma-pagination__jump'>
                前往
                <yma-input
                    class='el-pagination__editor is-in-pagination'
                    min={1}
                    max={this.$parent.internalPageCount}
                    value={this.userInput !== null ? this.userInput : this.$parent.internalCurrentPage}
                    type='number'
                    disabled={this.$parent.disabled}
                    nativeOnKeyup={this.handleKeyup}
                    onInput={this.handleInput}
                    onChange={this.handleChange}
                />
                页
            </span>
        );
    },
};
