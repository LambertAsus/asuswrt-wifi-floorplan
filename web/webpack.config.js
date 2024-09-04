const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/js/main.js',
    mode: 'production',
    // mode: 'development',
    output: {
        filename: 'js/main.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    performance : {
        hints : false
    },
    devServer: {
        static: path.resolve(__dirname, 'dist'),
        port: 8880,
        hot: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
        }),
        new CopyWebpackPlugin({
            patterns: [
                {from: './src/img', to: 'img'},
            ],
        }),
    ],
};