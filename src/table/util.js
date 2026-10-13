import {classnames} from './mixin/mouse/dom';
import {hasClass, addClass, removeClass, setStyles} from '../helper/dom';

export {hasClass, addClass, removeClass};

export const getValueByPath = function (object, prop) {
    prop = prop || '';
    const paths = prop.split('.');
    let current = object;
    let result = null;
    for (let i = 0, j = paths.length; i < j; i++) {
        const path = paths[i];
        if (!current) {
            break;
        }

        if (i === j - 1) {
            result = current[path];
            break;
        }
        current = current[path];
    }

    return result;
};

export function getPropByPath(obj, path, strict) {
    let tempObj = obj;
    path = path.replace(/\[(\w+)\]/g, '.$1');
    path = path.replace(/^\./, '');

    let keyArr = path.split('.');
    let i = 0;
    for (let len = keyArr.length; i < len - 1; ++i) {
        if (!tempObj && !strict) {
            break;
        }
        let key = keyArr[i];
        if (key in tempObj) {
            tempObj = tempObj[key];
        } else {
            if (strict) {
                throw new Error('please transfer a valid prop path to form item!');
            }
            break;
        }
    }

    return {
        o: tempObj,
        k: keyArr[i],
        v: tempObj ? tempObj[keyArr[i]] : null,
    };
}

export function mergeOptions(defaults, config) {
    function hasOwn(obj, key) {
        return Object.prototype.hasOwnProperty.call(obj, key);
    }

    const options = {};

    let key;
    for (key in defaults) {
        options[key] = defaults[key];
    }
    for (key in config) {
        if (hasOwn(config, key)) {
            const value = config[key];
            if (typeof value !== 'undefined') {
                options[key] = value;
            }
        }
    }
    return options;
}

export function compose(...funcs) {
    if (funcs.length === 0) {
        return arg => arg;
    }

    if (funcs.length === 1) {
        return funcs[0];
    }

    return funcs.reduce(
        (a, b) =>
            (...args) =>
                a(b(...args)),
    );
}

export function parseWidth(width) {
    if (width !== undefined) {
        width = parseInt(width, 10);
        if (isNaN(width)) {
            width = null;
        }
    }

    return width;
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

export function appendChild(node, child) {
    node.appendChild(child);
}

export function insertBefore(parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
}

export function insertAfter(parentNode, newNode, referenceNode) {
    if (parentNode.lastChild == referenceNode) {
        parentNode.appendChild(newNode);
    } else {
        parentNode.insertBefore(newNode, referenceNode.nextElementSibling);
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

export function toggleRowStatus(statusArr, row, newVal) {
    let changed = false;
    const index = statusArr.indexOf(row);
    const included = index !== -1;

    const addRow = () => {
        statusArr.push(row);
        changed = true;
    };
    const removeRow = () => {
        statusArr.splice(index, 1);
        changed = true;
    };

    if (typeof newVal === 'boolean') {
        if (newVal && !included) {
            addRow();
        } else if (!newVal && included) {
            removeRow();
        }
    } else {
        if (included) {
            removeRow();
        } else {
            addRow();
        }
    }

    return changed;
}

export const getRowIdentity = (row, rowKey) => {
    if (!row) {
        throw new Error('row is required when get row identity');
    }
    if (typeof rowKey === 'string') {
        if (rowKey.indexOf('.') < 0) {
            return row[rowKey];
        }
        let key = rowKey.split('.');
        let current = row;
        for (let i = 0; i < key.length; i++) {
            current = current[key[i]];
        }
        return current;
    } else if (typeof rowKey === 'function') {
        return rowKey.call(null, row);
    }
};

export const getKeysMap = function (array, rowKey) {
    const arrayMap = {};
    (array || []).forEach((row, index) => {
        arrayMap[getRowIdentity(row, rowKey)] = {row, index};
    });
    return arrayMap;
};
