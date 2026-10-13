let clipboardLoader;
let copyInstance = null;

function loadClipboard() {
    if (!clipboardLoader) {
        clipboardLoader = import('clipboard').then(mod => mod.default || mod);
    }
    return clipboardLoader;
}

function ensureCopyInstance(Clipboard) {
    if (copyInstance) {
        return copyInstance;
    }
    const btn = document.createElement('button');
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-hidden', 'true');
    btn.setAttribute('style', 'position: fixed; top: -9999px; left: -9999px;');
    document.body.appendChild(btn);
    copyInstance = {
        btn,
        clipboard: new Clipboard(btn),
    };
    return copyInstance;
}

function destroyCopy() {
    if (!copyInstance) {
        return;
    }
    if (copyInstance.btn && copyInstance.btn.parentNode) {
        copyInstance.btn.parentNode.removeChild(copyInstance.btn);
    }
    if (copyInstance.clipboard && typeof copyInstance.clipboard.destroy === 'function') {
        copyInstance.clipboard.destroy();
    }
    copyInstance = null;
}

function fallbackCopy(text) {
    return loadClipboard().then(Clipboard => {
        const instance = ensureCopyInstance(Clipboard);
        return new Promise((resolve, reject) => {
            const cleanup = () => {
                instance.clipboard.off('success', onSuccess);
                instance.clipboard.off('error', onError);
                instance.btn.setAttribute('data-clipboard-text', '');
            };
            const onSuccess = e => {
                if (e && e.clearSelection) {
                    e.clearSelection();
                }
                cleanup();
                resolve();
            };
            const onError = e => {
                cleanup();
                reject(e);
            };

            instance.btn.setAttribute('data-clipboard-text', text);
            instance.clipboard.on('success', onSuccess);
            instance.clipboard.on('error', onError);
            instance.btn.click();
        });
    });
}

export function write({filename, filetype, content, callback}) {
    const blob = new Blob([content], {type: filetype});
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (callback) {
        return callback();
    }
    return Promise.resolve();
}

export function download({url, filename}) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

export function copy(text = '', callback) {
    const value = text == null ? '' : String(text);
    const done = err => {
        if (typeof callback === 'function') {
            callback(err || null);
        }
        if (err) {
            return Promise.reject(err);
        }
        return Promise.resolve();
    };

    const viaClipboard = () => {
        if (
            typeof navigator !== 'undefined' &&
            navigator.clipboard &&
            typeof window !== 'undefined' &&
            window.isSecureContext
        ) {
            return navigator.clipboard.writeText(value);
        }
        return Promise.reject(new Error('clipboard api unavailable'));
    };

    return viaClipboard().then(
        () => done(),
        () => fallbackCopy(value).then(() => done(), done),
    );
}

export const $Copy = {
    copy,
    destroy: destroyCopy,
    destory: destroyCopy,
};
