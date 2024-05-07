export default {
    name: 'YmaTotal',
    props: {
        total: Number,
    },
    render(h) {
        return typeof this.total === 'number' ? (
            <span class='yma-pagination__total'>共 {total} 条结果</span>
        ) : (
            ''
        );
    },
};
