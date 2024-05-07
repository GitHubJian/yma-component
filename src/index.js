import Center from './center';
import Col from './col';
import Desktop from './desktop';
import Icon from './icon';
import Link from './link';
import List from './list';
import Menu from './menu';
import Panel from './panel';
import Scroll from './scroll';
import Row from './row';
import Table from './table';

const components = [
    Center,
    Col,
    Desktop,
    Icon,
    Link,
    List,
    Menu,
    Panel,
    Scroll,
    Row,
    Table,
];

const install = function (Vue) {
    components.forEach(function (component) {
        Vue.use(component.install);
    });
};

export default {
    install,
    Desktop,
    Icon,
    Menu,
    Panel,
    Link,
    List,
    Table,
    Scroll,
    Center,
};
