const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        main: ['./client/web/js/webpackModule.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, '/client/web/bundle'),
    },
    mode: 'production',
    stats: 'errors-only', //테스트시 주석 (로그 보임)
    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    /* devMode ? 'style-loader' : */
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ],
            },
        ], 
    },
    devtool: 'inline-source-map',
};
