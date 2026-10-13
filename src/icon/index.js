import {registerIcons} from './plugin';
import Main from './main.vue';

Main.install = function (Vue) {
    Vue.component(Main.name, Main);
};

export {registerIcons};
export default Main;
