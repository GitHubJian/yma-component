import {
    createElement,
    insertBefore,
    removeSelf,
    removeStyles,
    setStyles,
    on,
    off,
    getStyle,
    addClass,
    hasClass,
    removeClass,
} from './dom';
import delegate from './delegate';

const CLASSNAMES = {
    el: 'yma-dragsort',
    draging: 'yma-dragsort--draging',
    item: 'yma-dragsort__item',
    moving: 'yma-dragsort__item--moving',
    placeholder: 'yma-dragsort__placeholder',
};

function noop() {}

function check(e, clazz, topNode = document) {
    let t = e;

    while (!hasClass(t, clazz) && t != topNode) {
        t = t.parentNode;
    }

    if (t == topNode) {
        return null;
    }

    return t;
}

function mousesort(el, options) {
    const before = options.before || noop;
    const after = options.after || noop;
    const complete = options.complete || noop;

    let elX = 0;
    let elY = 0;
    let targetEl = null;
    let oldTargetElIndex = 0;
    let targetMargin = 0;
    let targetRect = {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
    };
    let phEl = null;
    let x = 0;
    let y = 0;
    let isStart = false;

    function isAbove(aEl, bEl) {
        const aRect = aEl.getBoundingClientRect();
        const bRect = bEl.getBoundingClientRect();

        const aCenter = aRect.top + aRect.height / 2;
        const bCenter = bRect.top + bRect.height / 2;

        return aCenter < bCenter;
    }
    function swap(aEl, bEl) {
        const aParent = aEl.parentNode;
        const bParent = bEl.parentNode;
        const aSiblingEl = aEl.nextSibling === bEl ? aEl : aEl.nextSibling;
        bParent.insertBefore(aEl, bEl);

        aParent.insertBefore(bEl, aSiblingEl);
    }

    function mousedownHandler(e) {
        const t = check(e.target, 'yma-table__append');

        if (t) {
            return;
        }

        targetEl = e.target;

        while (!hasClass(targetEl, CLASSNAMES.item)) {
            targetEl = targetEl.parentElement;

            if (targetEl === el) {
                targetEl = null;
                return;
            }
        }

        before && before();
        addClass(el, CLASSNAMES.draging);

        oldTargetElIndex = [].indexOf.call(el.children, targetEl);
        targetRect = targetEl.getBoundingClientRect();
        targetMargin = getStyle(targetEl, 'margin');

        x = e.clientX - targetRect.left;
        y = e.clientY - targetRect.top;

        addClass(targetEl, CLASSNAMES.moving);

        on(document, 'mousemove', mousemoveHandler);
        on(document, 'mouseup', mouseupHandler);
    }

    function mousemoveHandler(e) {
        if (!isStart) {
            isStart = true;

            phEl = createElement({
                attrs: {
                    class: CLASSNAMES.placeholder,
                    style: {
                        margin: targetMargin,
                        width: targetRect.width + 'px',
                        height: targetRect.height + 'px',
                    },
                },
            });

            insertBefore(
                targetEl.parentNode,
                phEl,
                targetEl.nextElementSibling
            );
        }

        const left = e.clientX - x - elX;
        const top = e.clientY - y - elY;
        setStyles(targetEl, {
            position: 'absolute',
            top: top + 'px',
            left: left + 'px',
            width: targetRect.width + 'px',
            height: targetRect.height + 'px',
            'z-index': 1000,
        });

        const prevEl = targetEl.previousElementSibling;
        const nextEl = phEl.nextElementSibling;

        if (prevEl && isAbove(targetEl, prevEl)) {
            swap(phEl, targetEl);
            swap(phEl, prevEl);
        } else if (nextEl && !isAbove(targetEl, nextEl)) {
            swap(nextEl, phEl);
            swap(nextEl, targetEl);
        }
    }

    function reset() {
        targetEl = null;
        oldTargetElIndex = 0;
        targetMargin = 0;
        targetRect = {
            left: 0,
            top: 0,
            width: 0,
            height: 0,
        };
        phEl = null;
        x = 0;
        y = 0;
        isStart = false;
    }
    function mouseupHandler() {
        if (phEl) {
            removeSelf(phEl);
        }

        removeStyles(targetEl, [
            'position',
            'top',
            'left',
            'width',
            'height',
            'z-index',
        ]);

        removeClass(targetEl, CLASSNAMES.moving);
        removeClass(el, CLASSNAMES.draging);

        off(document, 'mousemove', mousemoveHandler);
        off(document, 'mouseup', mouseupHandler);

        const newTargetElIndex = [].indexOf.call(el.children, targetEl);
        complete && complete(newTargetElIndex, oldTargetElIndex);

        reset();
    }

    function mousedownHandlerProxy(e) {
        mousedownHandler(e.nativeEvent);
    }

    function mounted() {
        const elRect = el.getBoundingClientRect();
        elX = elRect.left;
        elY = elRect.top;

        delegate.on(el, 'mousedown', mousedownHandlerProxy, CLASSNAMES.item);
    }

    mounted();

    return {
        destory: function destory() {
            delegate.off(el, 'mousedown', mousedownHandlerProxy);
        },
    };
}

export default mousesort;
