import Breadcrumb from './breadcrumb';
import Center from './center';
import Checkbox from './checkbox';
import Choice from './choice';
import Col from './col';
import Countdown from './countdown';
import Desktop from './desktop';
import Dropdown from './dropdown';
import Form from './form';
import Icon, {registerIcons} from './icon';
import Input from './input';
import Link from './link';
import List from './list';
import Menu from './menu';
import Pagination from './pagination';
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
    Input,
    Link,
    List,
    Menu,
    Pagination,
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
        if (component && typeof component.install === 'function') {
            component.install(Vue);
        }
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
    Input,
    Link,
    List,
    Menu,
    Pagination,
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
export {registerIcons};
