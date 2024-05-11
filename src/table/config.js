export const cellStarts = {
    selection: {
        width: 60,
    },
    index: {
        width: 80,
    },
};

export const cellForced = {
    selection: {
        renderHeader: function (h, {store}) {
            return <yma-checkbox on-input={this.toggleAllSelection} value={this.isAllSelected} />;
        },
        renderCell: function (h, {row, column, isSelected, store, $index}) {
            return (
                <yma-checkbox
                    nativeOn-click={e => e.stopPropagation()}
                    value={isSelected}
                    on-input={() => {
                        store.commit('rowSelectedChanged', row);
                    }}
                />
            );
        },
    },
    index: {
        renderHeader: function (h, {column}) {
            return column.label || '#';
        },
        renderCell: function (h, {$index, column}) {
            let i = $index + 1;
            const index = column.index;

            if (typeof index === 'number') {
                i = $index + index;
            } else if (typeof index === 'function') {
                i = index($index);
            }

            return <div>{i}</div>;
        },
    },
};
