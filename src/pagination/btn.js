export default {
    name: 'YmaBtn',
    props: {
        disabled: {
            type: Boolean,
            default: false,
        },
        type: {
            type: String,
            default: 'prev',
        },
        text: String,
    },
    render(h) {
        return (
            <button
                type='button'
                class={`yma-page__btn yma-page__btn--${this.type}`}>
                {this.text ? (
                    <span class='yma-page__btn-text'>{this.text}</span>
                ) : (
                    <i
                        class={`yma-page__btn-icon yma-page__btn-icon--${this.type}`}></i>
                )}
            </button>
        );
    },
};
