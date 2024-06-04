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

export function copy(text = '', callback) {
    const btn = document.createElement('button');
    btn.setAttribute('data-clipboard-text', text);
    document.body.appendChild(btn);

    let clipboard = new Clipboard(btn);
    clipboard.on('success', function (e) {
        console.info('Action:', e.action);
        console.info('Text:', e.text);
        console.info('Trigger:', e.trigger);

        e.clearSelection();

        clipboard = null;
        document.body.removeChild(btn);

        callback && callback(null);
    });

    clipboard.on('error', function (e) {
        console.error('Action:', e.action);
        console.error('Trigger:', e.trigger);

        clipboard = null;
        document.body.removeChild(btn);

        callback && callback(e);
    });

    btn.click();
}
