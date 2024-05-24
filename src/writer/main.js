import {write} from '../util';

export default {
    name: 'YmaWriter',
    props: {
        filename: {
            type: String,
            default: '',
        },
        filetype: {
            type: String,
            default: '',
        },
        content: {
            type: String,
            default: 'text/plain',
        },
        visible: Boolean,
    },
    data() {
        return {};
    },
    methods: {
        clickHandler() {
            write({
                filename: this.filename,
                content: this.content,
                filetype: this.filetype,
            });
        },
    },
    render(h) {
        return (
            <div
                class={{
                    'yma-writer': true,
                    'yma-writer--hidden': !this.visible,
                }}
                on-click={this.clickHandler}>
                <slot></slot>
            </div>
        );
    },
};
