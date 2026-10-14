import Grid from './grid.vue';
import Item from './item.vue';

Grid.install = function (Vue) {
    Vue.component(Grid.name, Grid);
    Vue.component(Item.name, Item);
};

Grid.Item = Item;

export default Grid;
