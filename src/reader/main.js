import YmaIcon from '../icon';
import YmaCenter from '../center';

function format(source, params) {
    if (arguments.length === 1) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            args.unshift(source);

            return format.apply(this, args);
        };
    }

    if (params === undefined) {
        return source;
    }

    if (arguments.length > 2 && params.constructor !== Array) {
        params = Array.prototype.slice.call(arguments, 1);
    }

    if (params.constructor !== Array) {
        params = [params];
    }

    params.forEach(function (param, i) {
        source = source.replace(new RegExp('\\{' + i + '\\}', 'g'), function () {
            return param;
        });
    });

    return source;
}

function decodeUTF8(buffer) {
    try {
        return new TextDecoder('utf-8', {fatal: true}).decode(buffer);
    } catch (e) {
        return null;
    }
}

const TEXT = {
    0: '选择文件',
    1: '正在解析文件 ({0})...',
    2: '文件 ({0}) 读取失败，文件编码仅支持 {1}',
};

export default {
    name: 'YmaReader',
    components: {
        YmaIcon,
        YmaCenter,
    },
    props: {
        accept: {
            type: Array,
            default: function () {
                return ['*'];
            },
        },
        type: {
            type: String,
            default: 'text',
            validator: val => {
                return ['buffer', 'text'].indexOf(val) > -1;
            },
        },
    },
    data() {
        return {
            file: Object.freeze({}),
            status: 0, // 0 初始化 1 成功 2 失败
            text: TEXT[0],
        };
    },
    mounted() {
        this.reader = new FileReader();
        this.reader.onload = e => {
            const buffer = e.target.result;
            const {name} = this.file;
            let content = buffer;

            if (this.type === 'text') {
                content = decodeUTF8(buffer);
                if (content == null) {
                    this.status = 2;
                    this.text = format(TEXT[2], name, 'UTF8');
                    this.$emit('error', name);
                    return;
                }
            }

            this.status = 1;
            this.text = format(TEXT[1], name);
            this.$emit('content', content, name);
        };

        this.reader.onerror = e => {
            const error = e && e.target && e.target.error;
            if (error && error.name === 'AbortError') {
                return;
            }
            this.status = 2;
            this.text = format(TEXT[2], this.file && this.file.name, 'UTF8');
            this.file = null;
            const message = e && e.target && e.target.error ? e.target.error.message : '';
            console.warn('Yma Reader: 文件读取失败，' + message);
        };
    },
    beforeDestroy() {
        if (!this.reader) {
            return;
        }
        if (this.reader.readyState === FileReader.LOADING) {
            this.reader.abort();
        }
        this.reader.onload = null;
        this.reader.onerror = null;
        this.reader = null;
    },
    methods: {
        changeHandler(e) {
            const file = e.target.files[0];
            e.target.value = '';
            if (!file || !this.reader) {
                return;
            }
            if (this.reader.readyState === FileReader.LOADING) {
                this.reader.abort();
            }
            this.file = file;
            this.reader.readAsArrayBuffer(file);
        },
        clickHandler() {
            this.$refs.input.click();
        },
        reset() {
            this.status = 0;
            this.text = TEXT[0];
        },
    },
    render(h) {
        const {status, text} = this;

        const accept = this.accept
            .map(function (e) {
                e = e.replace(/\s/g, '').toLowerCase();
                if (e.match(/^[^.][^/]+$/)) {
                    e = '.' + e;
                }

                return e;
            })
            .join(',');

        return (
            <div class='yma-reader'>
                <div class='yma-reader__inner' on-click={this.clickHandler}>
                    <yma-center align='center'>
                        <span class='yma-reader__logo'>
                            {status === 0 && <yma-icon name='symbol_cross'></yma-icon>}

                            <span class='yma-reader__text'>{text}</span>
                        </span>
                    </yma-center>
                </div>

                <input
                    ref='input'
                    class='yma-reader__input'
                    type='file'
                    accept={accept}
                    on-change={this.changeHandler}
                />
            </div>
        );
    },
};
