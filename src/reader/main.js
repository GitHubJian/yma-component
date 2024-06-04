import YmaIcon from '../icon';
import YmaCenter from '../center';

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
        };
    },
    mounted() {
        reader.onload = e => {
            const content = e.target.result;

            const {name} = this.file;
            this.$emit('content', content, name);
        };

        reader.onerror = e => {
            this.file = null;
            console.log('Yma Reader: 文件读取失败，' + e.message);
        };
    },
    methods: {
        changeHandler(e) {
            const file = e.target.files[0];
            e.target.value = '';
            this.file = file;

            if (this.type === 'text') {
                reader.readAsText(file);
            } else if (this.type === 'buffer') {
                reader.readAsArrayBuffer(file);
            }
        },
        clickHandler() {
            this.$refs.input.click();
        },
    },
    render(h) {
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
                            <yma-icon name='symbol_cross'></yma-icon>
                            <span class='yma-reader__text'>选择文件</span>
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
