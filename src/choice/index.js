import './main.scss';
import Choice from './choice';
import ChoiceItem from './choice-item';

Choice.install = function (Vue) {
    Vue.component(Choice.name, Choice);
    Vue.component(ChoiceItem.name, ChoiceItem);
};

export default Choice;
