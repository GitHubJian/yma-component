import {hasClass} from './util';

export default {
    name: 'YmaTableAppend',
    props: {
        appendHandler: {
            type: Function,
            default: () => {},
        },
    },
    data() {
        return {};
    },
    methods: {
        handler(e) {
            e.stopPropagation();

            this.appendHandler();
        },
    },
    render(h) {
        const handler = this.handler;

        return (
            <div class='yma-table__append' on-click={handler}>
                <span class='yma-table__append-line'></span>
                <span class='yma-table__append-icon'>
                    <span class='yma-table__append-p'></span>
                    <span class='yma-table__append-p is-v'></span>
                </span>
            </div>
        );
    },
};
