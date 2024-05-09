export default {
    name: 'YmaPager',
    props: {
        currentPage: Number,
        pageCount: Number,
        pagerCount: Number,
    },
    data() {
        return {
            current: null,
            showPrevMore: false,
            showNextMore: false,
        };
    },
    computed: {
        pagers() {
            const pagerCount = this.pageCount;
            const halfPagerCount = (pagerCount - 1) / 2;

            const currentPage = Number(this.currentPage);
            const pageCount = Number(this.pageCount);

            let showPrevMore = false;
            let showNextMore = false;

            if (pageCount > pagerCount) {
                if (currentPage > pagerCount - halfPagerCount) {
                    showPrevMore = true;
                }

                if (currentPage < pageCount - halfPagerCount) {
                    showNextMore = true;
                }
            }

            const array = [];

            if (showPrevMore && !showNextMore) {
                const startPage = pageCount - (pagerCount - 2);
                for (let i = startPage; i < pageCount; i++) {
                    array.push(i);
                }
            } else if (!showPrevMore && showNextMore) {
                for (let i = 2; i < pagerCount; i++) {
                    array.push(i);
                }
            } else if (showPrevMore && showNextMore) {
                const offset = Math.floor(pagerCount / 2) - 1;
                for (let i = currentPage - offset; i <= currentPage + offset; i++) {
                    array.push(i);
                }
            } else {
                for (let i = 2; i < pageCount; i++) {
                    array.push(i);
                }
            }

            this.showPrevMore = showPrevMore;
            this.showNextMore = showNextMore;

            return array;
        },
    },
    render(h) {
        const {pageCount, currentPage, disabled, showPrevMore, pagers, showNextMore} = this;

        return (
            <ul class='yma-pager'>
                {pageCount > 0 ? (
                    <li
                        class={{
                            'yma-pager__number': true,
                            'is-active': currentPage === 1,
                            'is-disabled': disabled,
                        }}
                    ></li>
                ) : null}

                {showPrevMore ? (
                    <li
                        class={{
                            'yma-pager__quick': true,
                            'yma-pager__quick-prev': true,
                            'is-disabled': disabled,
                        }}
                    ></li>
                ) : null}

                {pagers.map(pager => {
                    return (
                        <li
                            key={pager}
                            class={{
                                'yma-pager__number': true,
                                'is-active': currentPage === pager,
                                'is-disabled': disabled,
                            }}
                        >
                            {pager}
                        </li>
                    );
                })}

                {showNextMore ? (
                    <li
                        class={{
                            'yma-pager__quick': true,
                            'yma-pager__quick-next': true,
                            'is-disabled': disabled,
                        }}
                    ></li>
                ) : null}

                {pageCount > 1 ? (
                    <li
                        class={{
                            'yma-pager__number': true,
                            'is-active': currentPage === pageCount,
                            'is-disabled': disabled,
                        }}
                    >
                        {pageCount}
                    </li>
                ) : null}
            </ul>
        );
    },
};
