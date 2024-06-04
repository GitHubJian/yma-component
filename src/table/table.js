import TableHeader from './table-header';
import TableBody from './table-body';
import {createStore, mapStates} from './store';
import emitter from '../helper/emitter';

let tableIdSeed = 0;
export default {
    name: 'YmaTable',
    mixins: [emitter],
    props: {
        data: {
            type: Array,
            default: () => [],
        },
        rowClassName: [String, Function],
        cellClassName: [String, Function],
        emptyText: {
            default: '暂无数据',
        },
        //
        draggable: Boolean,
        addible: Boolean,
        rowSelectable: Boolean,
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
    methods: {
        toggleAllSelection() {
            this.store.commit('toggleAllSelection');
        },
        clearSelection() {
            this.store.clearSelection();
        },
        handleRowSelect(isActive, row, $index) {
            this.broadcast('YmaTableRow', 'passive', [$index]);

            this.$emit('select', isActive, row, $index);
        },
    },
    render(h) {
        const {
            store,
            $slots,
            data,
            fixed,
            draggable,
            addible,
            rowSelectable,

            rowClassName,
        } = this;

        return (
            <div
                class={{
                    'yma-table': true,
                    'yma-table--fixed': fixed,
                    'yma-table--empty': !data || data.length === 0,
                    'yma-table--row-selectable': rowSelectable,
                }}
            >
                <div class='yma-table__hidden' ref='hiddenColumns'>
                    {$slots.default}
                </div>

                <div class='yma-table__header-wrapper'>
                    <TableHeader store={store} fixed={fixed}></TableHeader>
                </div>

                <div ref='bodyWrapper' class='yma-table__body-wrapper'>
                    <TableBody
                        rowClassName={rowClassName}
                        store={store}
                        draggable={draggable}
                        addible={addible}
                        selectable={rowSelectable}
                    />
                </div>

                {!data || data.length === 0 ? (
                    <div class='yma-table__empty-wrapper'>
                        <div class='yma-table__empty'>
                            <div class='yma-table__empty-icon'>
                                <yma-icon name='blank-contents-empty' is-cover={true} />
                            </div>

                            <div class='yma-table__empty-text'>暂无数据</div>
                        </div>
                    </div>
                ) : null}
            </div>
        );
    },
};
