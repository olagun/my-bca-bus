'use strict';

const webpack = require('webpack');
const Merge = require('webpack-merge');
const path = require('path');

const CommonConfig = require('./webpack.common');

module.exports = Merge(CommonConfig, {
    devServer: {
        contentBase: path.resolve(__dirname, 'build'),
        compress: true,
        open: true
    }
});