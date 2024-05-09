export function on(el, event, handler) {
    if (document.addEventListener) {
        el.addEventListener(event, handler, false);
    } else {
        el.attachEvent('on' + event, handler);
    }
}

export function off(el, event, handler) {
    if (document.removeEventListener) {
        el.removeEventListener(event, handler, false);
    } else {
        el.detachEvent('on' + event, handler);
    }
}

export function hasClass(el, cls) {
    if (!el || !cls) {
        return false;
    }

    if (cls.indexOf(' ') !== -1) {
        throw new Error('className should not contain space.');
    }
    if (el.classList) {
        return el.classList.contains(cls);
    }
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

export function addClass(el, cls) {
    if (!el) {
        return;
    }
    let curClass = el.className;
    let classes = (cls || '').split(' ');

    for (let i = 0, j = classes.length; i < j; i++) {
        let clsName = classes[i];
        if (!clsName) {
            continue;
        }

        if (el.classList) {
            el.classList.add(clsName);
        } else if (!hasClass(el, clsName)) {
            curClass += ' ' + clsName;
        }
    }

    if (!el.classList) {
        el.setAttribute('class', curClass);
    }
}

function trim(string) {
    return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
}
export function removeClass(el, cls) {
    if (!el || !cls) {
        return;
    }
    let classes = cls.split(' ');
    let curClass = ' ' + el.className + ' ';

    for (let i = 0, j = classes.length; i < j; i++) {
        let clsName = classes[i];
        if (!clsName) {
            continue;
        }

        if (el.classList) {
            el.classList.remove(clsName);
        } else if (hasClass(el, clsName)) {
            curClass = curClass.replace(' ' + clsName + ' ', ' ');
        }
    }

    if (!el.classList) {
        el.setAttribute('class', trim(curClass));
    }
}

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

export function setStyles(el, styles) {
    const cssVarRE = /^--/;
    const importantRE = /\s*!important$/;
    const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
    const MOZ_HACK_REGEXP = /^moz([A-Z])/;

    function hyphenate(str) {
        let hyphenateRE = /\B([A-Z])/g;

        return str.replace(hyphenateRE, '-$1').toLowerCase();
    }

    function camelCase(name) {
        return name
            .replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
                return offset ? letter.toUpperCase() : letter;
            })
            .replace(MOZ_HACK_REGEXP, 'Moz$1');
    }

    function setStyle(el, name, val) {
        if (cssVarRE.test(name)) {
            el.style.setProperty(name, val);
        } else if (importantRE.test(val)) {
            el.style.setProperty(hyphenate(name), val.replace(importantRE, ''), 'important');
        } else {
            let normalizedName = camelCase(name);
            if (Array.isArray(val)) {
                for (let i = 0, len = val.length; i < len; i++) {
                    el.style[normalizedName] = val[i];
                }
            } else {
                el.style[normalizedName] = val;
            }
        }
    }

    for (const name in styles) {
        const cur = styles[name];
        setStyle(el, name, cur == null ? '' : cur);
    }
}

export function removeStyles(el, styleNames) {
    each(styleNames, function (_, name) {
        el.style.removeProperty(name);
    });
}

export function getStyle(el, styleName) {
    if (!el || !styleName) {
        return null;
    }

    const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
    const MOZ_HACK_REGEXP = /^moz([A-Z])/;

    function camelCase(name) {
        return name
            .replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
                return offset ? letter.toUpperCase() : letter;
            })
            .replace(MOZ_HACK_REGEXP, 'Moz$1');
    }

    styleName = camelCase(styleName);
    if (styleName === 'float') {
        styleName = 'cssFloat';
    }

    try {
        let computed = document.defaultView.getComputedStyle(el, '');
        return el.style[styleName] || computed ? computed[styleName] : null;
    } catch (e) {
        return el.style[styleName];
    }
}

export function styles2string(styles) {
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

    return `${selector} {${styles2string(styles)}}`;
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
