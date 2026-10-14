import Agreement from './agreement';
import Button from './button';
import Breadcrumb from './breadcrumb';
import Center from './center';
import Checkbox from './checkbox';
import Col from './col';
import Countdown from './countdown';
import Desktop from './desktop';
import Filter from './filter';
import Form from './form';
import Icon from './icon';
import Input from './input';
import Link from './link';
import List from './list';
import Menu from './menu';
import Pagination from './pagination';
import Panel from './panel';
import Row from './row';
import Table from './table';
import Tag from './tag';
import Text from './text';
import Reader from './reader';
import Writer from './writer';
import * as Util$ from './util';
import Message from './message';
import Grid from './grid';

const components = [
    Agreement,
    Button,
    Breadcrumb,
    Center,
    Checkbox,
    Col,
    Countdown,
    Desktop,
    Filter,
    Form,
    Icon,
    Input,
    Link,
    List,
    Menu,
    Pagination,
    Panel,
    Row,
    Table,
    Tag,
    Text,
    Reader,
    Writer,
    Message,
    Grid,
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
    Agreement,
    Button,
    Breadcrumb,
    Center,
    Checkbox,
    Col,
    Countdown,
    Desktop,
    Filter,
    Form,
    Icon,
    Input,
    Link,
    List,
    Menu,
    Pagination,
    Panel,
    Row,
    Table,
    Tag,
    Text,
    Reader,
    Writer,
    Message,
    Grid,
};

export const Util = Util$;
