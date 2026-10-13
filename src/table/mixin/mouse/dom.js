import {on, off, hasClass, addClass, removeClass, getStyle, setStyle, setStyles} from '../../../helper/dom';

export {on, off, hasClass, addClass, removeClass, getStyle, setStyle, setStyles};

function isArrayLike(obj) {
    if (obj && typeof obj === 'object') {
        let length = obj.length;

        return typeof length === 'number' && length >= 0 && Number.isInteger(length);
    }

    return false;
}

function each(obj, callback) {
    let length;
    let i = 0;

    if (isArrayLike(obj)) {
        length = obj.length;
        for (; i < length; i++) {
            if (callback.call(obj[i], i, obj[i]) === false) {
                break;
            }
        }
    } else {
        for (i in obj) {
            if (callback.call(obj[i], i, obj[i]) === false) {
                break;
            }
        }
    }

    return obj;
}

const hasOwn = {}.hasOwnProperty;

function parseValue(arg) {
    if (typeof arg === 'string') {
        return arg;
    }

    if (typeof arg !== 'object') {
        return '';
    }

    if (Array.isArray(arg)) {
        return classnames.apply(null, arg);
    }

    if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes('[native code]')) {
        return arg.toString();
    }

    let classes = '';

    for (const key in arg) {
        if (hasOwn.call(arg, key) && arg[key]) {
            classes = appendClass(classes, key);
        }
    }

    return classes;
}

function appendClass(value, newClass) {
    if (!newClass) {
        return value;
    }

    return value ? value + ' ' + newClass : newClass;
}

export function classnames() {
    let classes = '';

    for (let i = 0; i < arguments.length; i++) {
        const arg = arguments[i];
        if (arg) {
            classes = appendClass(classes, parseValue(arg));
        }
    }

    return classes;
}

export function removeStyles(el, styleNames) {
    each(styleNames, function (_, name) {
        el.style.removeProperty(name);
    });
}

export function sty2str(styles) {
    const cssVarRE = /^--/;
    const importantRE = /\s*!important$/;
    const caches = {};
    function setProp(name, val) {
        caches[name] = val;
    }

    function hyphenate(str) {
        let hyphenateRE = /\B([A-Z])/g;

        return str.replace(hyphenateRE, '-$1').toLowerCase();
    }

    function setStyle(name, val) {
        if (cssVarRE.test(name)) {
            setProp(name, val);
        } else if (importantRE.test(val)) {
            setProp(hyphenate(name), val);
        } else {
            let normalizedName = hyphenate(name);
            if (Array.isArray(val)) {
                for (let i = 0, len = val.length; i < len; i++) {
                    setProp(normalizedName, val[i]);
                }
            } else {
                setProp(normalizedName, val);
            }
        }
    }

    for (const name in styles) {
        const cur = styles[name];
        setStyle(name, cur == null ? '' : cur);
    }

    return Object.keys(caches)
        .map(function (key) {
            return key + ':' + caches[key];
        })
        .join(';');
}

export function setAttrs(el, attrs) {
    each(attrs, function (key, value) {
        if (key === 'style') {
            setStyles(el, value);
        } else if (key === 'class') {
            el.setAttribute('class', classnames(value));
        } else {
            el.setAttribute(key, value);
        }
    });
}

function isPlainObject(val) {
    return typeof val === 'object' && val !== null && val.constructor === Object;
}

export function removeAttrs(el, attrs) {
    if (isPlainObject(attrs)) {
        attrs = Object.keys(attrs);
    } else if (typeof attrs === 'string') {
        attrs = [attrs];
    }

    each(attrs, function (key) {
        el.removeAttribute(key);
    });
}

export function createElement({tag, attrs, children}) {
    const node = document.createElement(tag || 'div');

    each(attrs, function (key, value) {
        if (key === 'style') {
            setStyles(node, value);
        } else if (key === 'class') {
            node.setAttribute('class', classnames(value));
        } else {
            node.setAttribute(key, value);
        }
    });

    each(children, function (_, child) {
        node.appendChild(child);
    });

    return node;
}

export function createText(text) {
    return document.createTextNode(text);
}

export function createComment(text) {
    return document.createComment(text);
}

export function createStyleBlock(selector, styles) {
    if (Array.isArray(selector)) {
        selector = selector.join(' ');
    }

    return `${selector} {${sty2str(styles)}}`;
}

export function insertBefore(parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
}
export function removeChild(node, child) {
    node.removeChild(child);
}

export function removeSelf(node) {
    node.parentNode.removeChild(node);
}

export function appendChild(node, child) {
    node.appendChild(child);
}

export function parentNode(node) {
    return node.parentNode;
}

export function nextSibling(node) {
    return node.nextSibling;
}

export function tagName(node) {
    return node.tagName;
}

export function setTextContent(node, text) {
    node.textContent = text;
}
