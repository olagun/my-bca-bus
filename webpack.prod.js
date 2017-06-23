'use strict';

const webpack = require('webpack');
const Merge = require('webpack-merge');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BabiliPlugin = require('babili-webpack-plugin');

const CommonConfig = require('./webpack.common');


module.exports = Merge(CommonConfig, {
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(path.resolve(__dirname, 'public/index.html')),
            filename: path.resolve(path.resolve(__dirname, 'build/index.html'))
        }),
        new webpack.LoaderOptionsPlugin({
            debug: false,
            minimize: true
        }),
        new BabiliPlugin()
    ]
});