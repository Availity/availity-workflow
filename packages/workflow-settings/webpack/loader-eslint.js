module.exports = {
    loader: 'eslint-loader',
    test: /\.js$/,
    exclude: /node_modules/,

    options: {
        baseConfig: {
            extends: 'eslint-config-availity'
        }
    }
};