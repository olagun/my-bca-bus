'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: './index.js',
    output: {
        filename: 'js/bundle.js',
        publicPath: '/static/',
        path: path.resolve(__dirname, 'build/static')
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
        }, {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                use: ['css-loader', 'postcss-loader']
            })
        }]
    },
    plugins: [
        new ExtractTextPlugin('css/main.css'),
        new HtmlWebpackPlugin({
            template: path.resolve(path.resolve(__dirname, 'public/index.html')),
            filename: path.resolve(path.resolve(__dirname, 'build/index.html'))
        })
    ]
}