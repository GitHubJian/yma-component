const SPECIAL_CHARS_REGEXP = /([:\-_]+(.))/g;
const MOZ_HACK_REGEXP = /^moz([A-Z])/;
const HYPHENATE_RE = /\B([A-Z])/g;

function trim(string) {
    return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
}

export function camelCase(name) {
    return name
        .replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
            return offset ? letter.toUpperCase() : letter;
        })
        .replace(MOZ_HACK_REGEXP, 'Moz$1');
}

export function hyphenate(str) {
    return String(str).replace(HYPHENATE_RE, '-$1').toLowerCase();
}

export function on(element, event, handler) {
    if (element && event && handler) {
        element.addEventListener(event, handler, false);
    }
}

export function off(element, event, handler) {
    if (element && event) {
        element.removeEventListener(event, handler, false);
    }
}

export function hasClass(el, className) {
    if (!el || !className) {
        return false;
    }
    if (className.indexOf(' ') !== -1) {
        throw new Error('className should not contain space');
    }
    if (el.classList) {
        return el.classList.contains(className);
    }
    return (' ' + el.className + ' ').indexOf(' ' + className + ' ') > -1;
}

export function addClass(el, className) {
    if (!el) {
        return;
    }
    let curClass = el.className;
    const classes = (className || '').split(' ');

    for (let i = 0, j = classes.length; i < j; i++) {
        const clsName = classes[i];
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

export function removeClass(el, className) {
    if (!el || !className) {
        return;
    }
    const classes = className.split(' ');
    let curClass = ' ' + el.className + ' ';

    for (let i = 0, j = classes.length; i < j; i++) {
        const clsName = classes[i];
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

export function getStyle(el, styleName) {
    if (!el || !styleName) {
        return null;
    }
    styleName = camelCase(styleName);
    if (styleName === 'float') {
        styleName = 'cssFloat';
    }
    try {
        const computed = document.defaultView.getComputedStyle(el, '');
        return el.style[styleName] || (computed ? computed[styleName] : null);
    } catch (e) {
        return el.style[styleName];
    }
}

export function setStyle(el, styleName, value) {
    if (!el || styleName == null || styleName === '') {
        return;
    }

    if (typeof styleName === 'object') {
        for (const prop in styleName) {
            if (Object.prototype.hasOwnProperty.call(styleName, prop)) {
                setStyle(el, prop, styleName[prop]);
            }
        }
        return;
    }

    const name = camelCase(styleName);
    if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
            el.style[name] = value[i];
        }
        return;
    }
    el.style[name] = value;
}

const CSS_VAR_RE = /^--/;
const IMPORTANT_RE = /\s*!important$/;

export function setStyles(el, styles) {
    if (!el || !styles) {
        return;
    }

    for (const name in styles) {
        if (!Object.prototype.hasOwnProperty.call(styles, name)) {
            continue;
        }
        const val = styles[name] == null ? '' : styles[name];
        if (CSS_VAR_RE.test(name)) {
            el.style.setProperty(name, val);
        } else if (typeof val === 'string' && IMPORTANT_RE.test(val)) {
            el.style.setProperty(hyphenate(name), val.replace(IMPORTANT_RE, ''), 'important');
        } else {
            setStyle(el, name, val);
        }
    }
}
