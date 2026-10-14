import Dropdown from './dropdown.vue';
import DropdownMenu from './dropdown-menu.vue';
import DropdownItem from './dropdown-item.vue';

Dropdown.install = function (Vue) {
    Vue.component(Dropdown.name, Dropdown);
    Vue.component(DropdownMenu.name, DropdownMenu);
    Vue.component(DropdownItem.name, DropdownItem);
};

export default Dropdown;
