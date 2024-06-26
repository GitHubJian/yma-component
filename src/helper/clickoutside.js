import {on} from './dom';

const nodeList = [];
const ctx = '@@clickoutsideContext';

let startClick;
let seed = 0;

on(document, 'mousedown', e => (startClick = e));

on(document, 'mouseup', e => {
    nodeList.forEach(node => node[ctx].documentHandler(e, startClick));
});

function createDocumentHandler(el, binding, vnode) {
    return function (mouseup = {}, mousedown = {}) {
        if (
            !vnode ||
            !vnode.context ||
            !mouseup.target ||
            !mousedown.target ||
            el.contains(mouseup.target) ||
            el.contains(mousedown.target) ||
            el === mouseup.target ||
            (vnode.context.popperEl &&
                (vnode.context.popperEl.contains(mouseup.target) || vnode.context.popperEl.contains(mousedown.target)))
        ) {
            return;
        }

        if (binding.expression && el[ctx].methodName && vnode.context[el[ctx].methodName]) {
            vnode.context[el[ctx].methodName]();
        } else {
            el[ctx].bindingFn && el[ctx].bindingFn();
        }
    };
}

export default {
    bind(el, binding, vnode) {
        nodeList.push(el);
        const id = seed++;

        el[ctx] = {
            id,
            documentHandler: createDocumentHandler(el, binding, vnode),
            methodName: binding.expression,
            bindingFn: binding.value,
        };
    },
    update(el, binding, vnode) {
        el[ctx].documentHandler = createDocumentHandler(el, binding, vnode);
        el[ctx].methodName = binding.expression;
        el[ctx].bindingFn = binding.value;
    },
    unbind(el) {
        let len = nodeList.length;
        for (let i = 0; i < len; i++) {
            if (nodeList[i][ctx].id === el[ctx].id) {
                nodeList.splice(i, 1);
                break;
            }
        }

        delete el[ctx];
    },
};
