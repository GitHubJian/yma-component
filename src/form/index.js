import Form from './form.vue';
import FormItem from './form-item.vue';
import FormError from './form-error.vue';

Form.install = function (Vue) {
    Vue.component(Form.name, Form);
    Vue.component(FormItem.name, FormItem);
    Vue.component(FormError.name, FormError);
};

export default Form;
