module.exports = {
    loader: "eslint-loader",
    exclude: /node_modules/,
    enforce: "pre",
    test: /\.js?$/,
    options: {
        baseConfig: {
            extends: 'eslint-config-availity'
        }
    }
};