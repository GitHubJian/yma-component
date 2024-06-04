import Breadcrumb from './breadcrumb';
import Center from './center';
import Checkbox from './checkbox';
import Choice from './choice';
import Col from './col';
import Countdown from './countdown';
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
import Reader from './reader';
import Writer from './writer';
import * as Util$ from './util';
import Message from './message';

const components = [
    Breadcrumb,
    Center,
    Checkbox,
    Choice,
    Col,
    Countdown,
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
    Reader,
    Writer,
    Message,
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
    Checkbox,
    Choice,
    Col,
    Countdown,
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
    Reader,
    Writer,
    Message,
};

export const Util = Util$;
