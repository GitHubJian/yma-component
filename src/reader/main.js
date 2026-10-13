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
        source = source.replace(
            new RegExp('\\{' + i + '\\}', 'g'),
            function () {
                return param;
            }
        );
    });

    return source;
}

function isUTF8(content) {
    return content.indexOf('�') === -1;
}

const TEXT = {
    0: '选择文件',
    1: '正在解析文件 ({0})...',
    2: '文件 ({0}) 读取失败，文件编码仅支持 {1}',
};

const reader = new FileReader();
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
        const that = this;
        reader.onload = e => {
            const content = e.target.result;
            const {name} = this.file;
            if (this.type === 'text') {
                if (isUTF8(content)) {
                    this.status = 1;
                    this.text = format(TEXT[1], name);
                } else {
                    this.status = 2;
                    this.text = format(TEXT[2], name, 'UTF8');
                }
            } else {
                this.status = 1;
                this.text = format(TEXT[1], name);
            }

            this.$emit('content', content, name);
        };

        reader.onerror = e => {
            this.status = 2;
            this.text = format(TEXT[2]);

            this.file = null;
            console.warn('Yma Reader: 文件读取失败，' + e.message);
        };
    },
    methods: {
        changeHandler(e) {
            const file = e.target.files[0];
            e.target.value = '';
            this.file = file;

            if (this.type === 'text') {
                // TODO 判断文件是否为 UTF-8
                reader.readAsText(file);
            } else if (this.type === 'buffer') {
                reader.readAsArrayBuffer(file);
            }
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
                            {status === 0 && (
                                <yma-icon name='symbol_cross'></yma-icon>
                            )}

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
