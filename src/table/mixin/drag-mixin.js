function trim(string) {
    return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
}

function hasClass(el, cls) {
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

function addClass(el, cls) {
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

function removeClass(el, cls) {
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

const CLASSNAMES = {
    placeholder: 'is-moving',
};

let targetEl = null;
let dragEl = null;
let targetElIndex = 0;
let currentElIndex = 0;

export default {
    mounted() {
        dragEl = this.$refs.tbody;
    },
    methods: {
        dragstart(e) {
            e.dataTransfer.effectAllowed = 'move';
            targetEl = e.target;

            setTimeout(function () {
                addClass(targetEl, CLASSNAMES.placeholder);
            });
        },
        dragenter(e) {
            e.preventDefault();
            if (e.target === targetEl || e.target === dragEl) {
                return;
            }

            let dragedEl = e.target;
            while (!hasClass(dragedEl, 'yma-table__tr')) {
                dragedEl = dragedEl.parentElement;
                if (dragedEl === dragEl) {
                    return;
                }
            }

            let children = Array.from(dragEl.children);

            targetElIndex = children.indexOf(targetEl);
            currentElIndex = children.indexOf(dragedEl);
        },
        dragover(e) {
            e.preventDefault();
        },
        dragend(e) {
            this.updateData(targetElIndex, currentElIndex);
            removeClass(targetEl, CLASSNAMES.placeholder);
        },
        updateData(targetElIndex, currentElIndex) {
            this.$nextTick(() => {
                const store = this.table.store;

                let data = store.states.data;
                let targetElData = data[targetElIndex];
                let currentElData = data[currentElIndex];

                data.splice(targetElIndex, 1, currentElData);
                data.splice(currentElIndex, 1, targetElData);

                this.store.commit('setData', data);

                this.reset();
            });
        },
        reset() {
            let targetEl = null;
            let dragEl = null;
            let targetElIndex = 0;
            let currentElIndex = 0;
        },
    },
};
