const path = require('path');

const config = {
    page: {
        test: path.resolve(__dirname, './src/page/test/index.js'),
    },
    filenameHashing: false,
    publicPath: '/',
    presets: ['yma-config-preset'],
};

module.exports = config;
