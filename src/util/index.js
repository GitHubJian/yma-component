import Clipboard from 'clipboard';
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
    let a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function Copy() {
    this.btn = document.createElement('button');
    this.btn.setAttribute('style', 'position: fixed; top: -9999px; left: -9999px;');

    this.clipboard = new Clipboard(this.btn);
    this.clipboard.on('success', function (e) {
        console.info('Action:', e.action);
        console.info('Text:', e.text);
        console.info('Trigger:', e.trigger);
    });

    this.clipboard.on('error', function (e) {
        console.error('Action:', e.action);
        console.error('Trigger:', e.trigger);
    });

    document.body.appendChild(this.btn);
}

Copy.prototype.copy = function (text = '', callback) {
    const that = this;
    this.btn.setAttribute('data-clipboard-text', text);

    const successCallback = function (e) {
        e.clearSelection();

        that.clipboard.off('success', successCallback);
        that.clipboard.off('error', failCallback);

        that.btn.setAttribute('data-clipboard-text', '');

        callback && callback(null);
    };

    const failCallback = function (e) {
        that.clipboard.off('success', successCallback);
        that.clipboard.off('error', failCallback);

        that.btn.setAttribute('data-clipboard-text', '');

        callback && callback(e);
    };

    this.clipboard.on('success', successCallback);
    this.clipboard.on('error', failCallback);

    this.btn.click();
};

Copy.prototype.destory = function () {
    document.body.removeChild(btn);
    this.clipboard.destory();

    this.btn = null;
    this.clipboard = null;
};

export const $Copy = new Copy();
export const copy = $Copy.copy.bind($Copy);
