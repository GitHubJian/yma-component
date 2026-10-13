import {on, off} from './dom';

const nodeList = [];
const ctx = '@@clickoutsideContext';

let startClick;
let seed = 0;
let listening = false;

function handleMouseDown(e) {
    startClick = e;
}

function handleMouseUp(e) {
    nodeList.forEach(node => {
        const context = node[ctx];
        if (context) {
            context.documentHandler(e, startClick);
        }
    });
}

function ensureListening() {
    if (listening || typeof document === 'undefined') {
        return;
    }
    on(document, 'mousedown', handleMouseDown);
    on(document, 'mouseup', handleMouseUp);
    listening = true;
}

function stopListening() {
    if (!listening || nodeList.length || typeof document === 'undefined') {
        return;
    }
    off(document, 'mousedown', handleMouseDown);
    off(document, 'mouseup', handleMouseUp);
    listening = false;
    startClick = null;
}

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
        ensureListening();
    },
    update(el, binding, vnode) {
        if (!el[ctx]) {
            return;
        }
        el[ctx].documentHandler = createDocumentHandler(el, binding, vnode);
        el[ctx].methodName = binding.expression;
        el[ctx].bindingFn = binding.value;
    },
    unbind(el) {
        if (!el[ctx]) {
            return;
        }
        for (let i = 0; i < nodeList.length; i++) {
            if (nodeList[i][ctx] && nodeList[i][ctx].id === el[ctx].id) {
                nodeList.splice(i, 1);
                break;
            }
        }
        delete el[ctx];
        stopListening();
    },
};
