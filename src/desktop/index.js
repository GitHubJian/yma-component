import Desktop from './index.vue';
import Container from './container.vue';
import Main from './main.vue';
import Header from './header.vue';
import Footer from './footer.vue';

Desktop.install = function (Vue) {
    Vue.component(Desktop.name, Desktop);
    Vue.component(Container.name, Container);
    Vue.component(Main.name, Main);
    Vue.component(Header.name, Header);
    Vue.component(Footer.name, Footer);
};

export default Desktop;
