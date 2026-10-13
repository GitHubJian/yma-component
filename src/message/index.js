import Vue from 'vue';
import Main from './main.vue';

const MessageCtor = Vue.extend(Main);
const instances = [];
const GAP = 16;

function normalize(options) {
    if (typeof options === 'string') {
        return {message: options};
    }
    return options || {};
}

function layout(offset) {
    let top = offset;
    instances.forEach(item => {
        if (!item.$el) {
            return;
        }
        item.$el.style.top = top + 'px';
        top += (item.$el.offsetHeight || 40) + GAP;
    });
}

function Message(options) {
    const config = normalize(options);
    const instance = new MessageCtor({
        propsData: {
            type: config.type || 'info',
            message: config.message || '',
            border: config.border !== false,
        },
    });

    instance.$mount();
    instance.$el.style.position = 'fixed';
    instance.$el.style.left = '50%';
    instance.$el.style.zIndex = config.zIndex || 2000;
    instance.$el.style.transform = 'translateX(-50%)';
    document.body.appendChild(instance.$el);
    instances.push(instance);

    const offset = config.offset == null ? GAP : config.offset;
    layout(offset);

    const duration = config.duration === undefined ? 3000 : config.duration;
    let timer = null;

    instance.close = function close() {
        if (instance._closed) {
            return;
        }
        instance._closed = true;
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        const index = instances.indexOf(instance);
        if (index > -1) {
            instances.splice(index, 1);
        }
        if (instance.$el && instance.$el.parentNode) {
            instance.$el.parentNode.removeChild(instance.$el);
        }
        instance.$destroy();
        layout(offset);
        if (typeof config.onClose === 'function') {
            config.onClose();
        }
    };

    if (duration > 0) {
        timer = setTimeout(instance.close, duration);
    }

    return instance;
}

['info', 'success', 'warning', 'error'].forEach(type => {
    Message[type] = function (options) {
        const normalized = normalize(options);
        normalized.type = type;
        return Message(normalized);
    };
    Main[type] = Message[type];
});

Main.install = function (VueCtor) {
    VueCtor.component(Main.name, Main);
    VueCtor.prototype.$message = Message;
};

export {Message};
export default Main;
