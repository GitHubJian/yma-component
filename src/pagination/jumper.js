export default {
    name: 'YmaJumper',
    data() {
        return {
            input: null,
        };
    },
    render(h) {
        return (
            <span class='yma-pagination__jump'>
                前往
                <input class='yma-pagination__jump-input'></input>页
            </span>
        );
    },
};
