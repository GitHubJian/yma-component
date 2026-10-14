import Filter from './filter.vue';
import FilterOption from './filter-option.vue';

Filter.install = function (Vue) {
    Vue.component(Filter.name, Filter);
    Vue.component(FilterOption.name, FilterOption);
};

export default Filter;
