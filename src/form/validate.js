export function clone(value) {
    if (Array.isArray(value)) {
        return value.map(clone);
    }
    if (value && typeof value === 'object') {
        const out = {};
        Object.keys(value).forEach(key => {
            out[key] = clone(value[key]);
        });
        return out;
    }
    return value;
}

export function getProp(obj, path) {
    if (!obj || !path) {
        return undefined;
    }
    const keys = String(path)
        .replace(/\[(\w+)\]/g, '.$1')
        .replace(/^\./, '')
        .split('.');
    let current = obj;
    for (let i = 0; i < keys.length; i++) {
        if (current == null) {
            return undefined;
        }
        current = current[keys[i]];
    }
    return current;
}

export function setProp(obj, path, value) {
    if (!obj || !path) {
        return;
    }
    const keys = String(path)
        .replace(/\[(\w+)\]/g, '.$1')
        .replace(/^\./, '')
        .split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (current[key] == null || typeof current[key] !== 'object') {
            current[key] = {};
        }
        current = current[key];
    }
    current[keys[keys.length - 1]] = value;
}

function toList(rules) {
    if (!rules) {
        return [];
    }
    return Array.isArray(rules) ? rules.slice() : [rules];
}

export function normalizeRules(formRules, selfRules) {
    return toList(formRules).concat(toList(selfRules));
}

function isEmpty(value) {
    return value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);
}

function builtinMessage(rule, value) {
    if (rule.required && isEmpty(value)) {
        return rule.message || '必填';
    }
    if (!isEmpty(value) && rule.pattern && !rule.pattern.test(String(value))) {
        return rule.message || '格式不正确';
    }
    if (!isEmpty(value) && rule.min != null && String(value).length < rule.min) {
        return rule.message || '长度不足';
    }
    if (!isEmpty(value) && rule.max != null && String(value).length > rule.max) {
        return rule.message || '长度超出';
    }
    if (typeof rule.type === 'string' && !isEmpty(value)) {
        if (rule.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) {
            return rule.message || '邮箱格式不正确';
        }
        if (rule.type === 'number' && Number.isNaN(Number(value))) {
            return rule.message || '必须为数字';
        }
    }
    return '';
}

function toMessage(error) {
    if (!error) {
        return '';
    }
    if (error instanceof Error) {
        return error.message;
    }
    return String(error);
}

function runRule(rule, value) {
    const builtin = builtinMessage(rule, value);
    if (builtin) {
        return Promise.resolve(builtin);
    }
    if (typeof rule.validator !== 'function') {
        return Promise.resolve('');
    }

    return new Promise(resolve => {
        let settled = false;
        const finish = error => {
            if (settled) {
                return;
            }
            settled = true;
            resolve(toMessage(error));
        };
        let result;
        try {
            result = rule.validator(rule, value, finish);
        } catch (error) {
            finish(error);
            return;
        }
        if (result && typeof result.then === 'function') {
            result.then(
                () => finish(),
                error => finish(error || '校验失败'),
            );
            return;
        }
        if (!settled && result !== undefined) {
            finish(result === true || result == null ? null : result);
        }
    });
}

export function validateRules(rules, value) {
    const list = rules || [];
    let chain = Promise.resolve('');
    list.forEach(rule => {
        chain = chain.then(message => {
            if (message) {
                return message;
            }
            return runRule(rule, value);
        });
    });
    return chain;
}

export function matchTrigger(rule, trigger) {
    if (!trigger || !rule.trigger) {
        return true;
    }
    if (Array.isArray(rule.trigger)) {
        return rule.trigger.indexOf(trigger) > -1;
    }
    return rule.trigger === trigger;
}
