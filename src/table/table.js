import TableHeader from './table-header';
import TableBody from './table-body';
import TableBodyInput from './table-body-input';
import {createStore, mapStates} from './store';

let tableIdSeed = 0;
export default {
    name: 'YmaTable',
    props: {
        data: {
            type: Array,
            default: () => [],
        },
        emptyText: {
            default: '暂无数据',
        },
        fixed: Boolean,
    },
    data() {
        this.store = createStore(this, {});

        return {};
    },
    computed: {
        ...mapStates({
            columns: 'columns',
            fixedColumns: 'fixedColumns',
        }),
    },
    watch: {
        data: {
            immediate: true,
            handler(value) {
                this.store.commit('setData', value);
            },
        },
    },
    created() {
        this.tableId = 'yma-table_' + tableIdSeed++;
    },
    mounted() {
        this.store.updateColumns();

        this.$ready = true;
    },
    render(h) {
        const {store, $slots, data, fixed} = this;

        return (
            <div
                class={{
                    'yma-table': true,
                    'yma-table--fixed': fixed,
                }}
            >
                <div class='yma-table__hidden' ref='hiddenColumns'>
                    {$slots.default}
                </div>

                <div class='yma-table__header-wrapper'>
                    <TableHeader store={store} fixed={fixed}></TableHeader>
                </div>

                <div ref='bodyWrapper' class='yma-table__body-wrapper'>
                    <TableBody store={store} draggable={true} />

                    {!data || data.length === 0 ? (
                        <div class='yma-table__empty'>
                            <span class='yma-table__empty-text'>暂无数据</span>
                        </div>
                    ) : null}
                </div>
            </div>
        );
    },
};
