const OPEN_DELAY = 300;

export default {
    beforeDestroy() {
        this.unbindPopup();
    },
    methods: {
        show() {
            if (this.disabled) {
                return;
            }
            this.openLater(true);
        },
        hide() {
            this.openLater(false);
        },
        handleClick() {
            if (this.disabled) {
                return;
            }
            if (this.visible) {
                this.hide();
            } else {
                this.show();
            }
        },
        openLater(visible) {
            clearTimeout(this._popupTimer);
            this._popupTimer = setTimeout(() => {
                this._popupTimer = null;
                this.visible = visible;
            }, OPEN_DELAY);
        },
        bindPopup(triggerEl, popperEl) {
            this.unbindPopup();
            if (!triggerEl || this.disabled) {
                return;
            }

            const handlers = [];
            const add = (el, event, handler) => {
                if (!el || !handler) {
                    return;
                }
                el.addEventListener(event, handler);
                handlers.push([el, event, handler]);
            };

            if (this.trigger === 'hover') {
                add(triggerEl, 'mouseenter', this.show);
                add(triggerEl, 'mouseleave', this.hide);
                add(popperEl, 'mouseenter', this.show);
                add(popperEl, 'mouseleave', this.hide);
            } else if (this.trigger === 'click') {
                add(triggerEl, 'click', this.handleClick);
            }

            this._popupHandlers = handlers;
        },
        unbindPopup() {
            clearTimeout(this._popupTimer);
            this._popupTimer = null;
            (this._popupHandlers || []).forEach(([el, event, handler]) => {
                el.removeEventListener(event, handler);
            });
            this._popupHandlers = null;
        },
    },
};
