import List from './list.vue';
import Item from './item.vue';

List.install = function (Vue) {
    Vue.component(List.name, List);
    Vue.component(Item.name, Item);
};

export default List;
