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
        write({filename, filetype, content, callback}) {
            const blob = new Blob([content], {type: filetype});
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = filename;

            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            if (callback) {
                return callback();
            } else {
                return Promise.resolve();
            }
        },
        clickHandler() {
            this.write({
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
