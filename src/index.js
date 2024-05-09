import Breadcrumb from './breadcrumb';
import Center from './center';
import Col from './col';
import Desktop from './desktop';
import Dropdown from './dropdown';
import Form from './form';
import Icon from './icon';
import Link from './link';
import List from './list';
import Menu from './menu';
import Panel from './panel';
import Scroll from './scroll';
import Row from './row';
import Table from './table';
import Tag from './tag';
import Text from './text';

const components = [
    Breadcrumb,
    Center,
    Col,
    Desktop,
    Dropdown,
    Form,
    Icon,
    Link,
    List,
    Menu,
    Panel,
    Scroll,
    Row,
    Table,
    Tag,
    Text,
];

const install = function (Vue) {
    components.forEach(function (component) {
        Vue.use(component.install);
    });
};

export default {
    install,
    Breadcrumb,
    Center,
    Col,
    Desktop,
    Dropdown,
    Form,
    Icon,
    Link,
    List,
    Menu,
    Panel,
    Scroll,
    Row,
    Table,
    Tag,
    Text,
};
