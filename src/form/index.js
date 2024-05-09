import Form from './form.vue';
import FormItem from './form-item.vue';
import FromError from './form-error.vue';

Form.install = function (Vue) {
    Vue.component(Form.name, Form);
    Vue.component(FormItem.name, FormItem);
    Vue.component(FromError.name, FromError);
};

export default Form;
