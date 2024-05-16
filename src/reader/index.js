import './main.scss';
import Main from './main.js';

Main.install = function (Vue) {
    Vue.component(Main.name, Main);
};

export default Main;
