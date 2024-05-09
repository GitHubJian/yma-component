import Btn from './btn';
import Pager from './pager';
import Total from './total';
import Jumper from './jumper';

export default {
    name: 'YmaPagination',
    components: {
        Btn,
        Pager,
        Total,
        Jumper,
    },
    props: {
        pageSize: {
            type: Number,
            default: 10,
        },
        pageCount: Number,
        pagerCount: {
            type: Number,
            validator(value) {
                return (value | 0) === value && value > 4 && value < 22 && value % 2 === 1;
            },
            default: 7,
        },
        currentPage: {
            type: Number,
            default: 1,
        },
    },
    data() {
        return {
            internalCurrentPage: 1,
            internalPageSize: 0,
            lastEmittedPage: -1,
            userChangePageSize: false,
        };
    },
    render(h) {
        const {total, internalCurrentPage, internalPageCount, pagerCount} = this;

        return (
            <div class='yma-pagination'>
                <div class='yma-pagination__left'>
                    <Total total={total} />
                </div>
                <div class='yma-pagination__right'>
                    <Btn type='prev'></Btn>
                    <Pager currentPage={internalCurrentPage} pageCount={internalPageCount} pagerCount={pagerCount} />
                    <Btn type='next'></Btn>

                    <Jumper></Jumper>
                </div>
            </div>
        );
    },
};
