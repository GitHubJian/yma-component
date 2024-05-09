const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
const MOZ_HACK_REGEXP = /^moz([A-Z])/;

const trim = function (string) {
    return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
};

const camelCase = function (name) {
    return name
        .replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
            return offset ? letter.toUpperCase() : letter;
        })
        .replace(MOZ_HACK_REGEXP, 'Moz$1');
};

export const on = (function on() {
    if (document.addEventListener) {
        return function (element, event, handler) {
            if (element && event && handler) {
                element.addEventListener(event, handler, false);
            }
        };
    }
    return function (element, event, handler) {
        if (element && event && handler) {
            element.attachEvent('on' + event, handler);
        }
    };
})();

export const off = (function () {
    if (document.removeEventListener) {
        return function (element, event, handler) {
            if (element && event) {
                element.removeEventListener(event, handler, false);
            }
        };
    }
    return function (element, event, handler) {
        if (element && event) {
            element.detachEvent('on' + event, handler);
        }
    };
})();

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
    let classes = (className || '').split(' ');

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

export function removeClass(el, className) {
    if (!el || !className) {
        return;
    }
    let classes = className.split(' ');
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

export const getStyle = function (el, styleName) {
    if (!el || !styleName) {
        return null;
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
};

export function setStyle(el, styleName, value) {
    if (!element || !styleName) {
        return;
    }

    if (typeof styleName === 'object') {
        for (let prop in styleName) {
            if (styleName.hasOwnProperty(prop)) {
                setStyle(element, prop, styleName[prop]);
            }
        }
    } else {
        styleName = camelCase(styleName);

        element.style[styleName] = value;
    }
}
