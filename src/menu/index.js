import Menu from './menu.vue';
import Item from './item.vue';
import SubMenu from './submenu.vue';

Menu.install = function (Vue) {
    Vue.component(Menu.name, Menu);
    Vue.component(Item.name, Item);
    Vue.component(SubMenu.name, SubMenu);
};

export default Menu;
