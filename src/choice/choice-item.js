export default {
    name: 'YmaChoiceItem',
    componentName: 'YmaChoiceItem',
    props: {
        label: String,
        id: {
            type: String,
            required: true,
        },
        metadata: {},
    },
    data() {
        return {};
    },
    computed: {
        owner() {
            let parent = this.$parent;
            while (parent && !parent.choiceId) {
                parent = parent.$parent;
            }

            return parent;
        },
    },
    created() {
        this.config = {
            id: this.id,
            label: this.label,
            metadata: this.metadata
        };
    },
    mounted() {
        const owner = this.owner;
        owner.store.commit('insert', this.config);
    },
    render(h) {
        return h('div', this.$slots.default);
    },
};
