'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, 'src/index.js'),
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build/static/js')
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['es2015']
                }
            }
        }, {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                // fallback: 'style-loader',
                use: ['css-loader', 'postcss-loader']
            })
        }]
    },
    plugins: [
        new ExtractTextPlugin('../css/main.css'),
        new HtmlWebpackPlugin({
            template: path.resolve(path.resolve(__dirname, 'public/index.html')),
            filename: path.resolve(path.resolve(__dirname, 'build/index.html'))
        })
    ]
}