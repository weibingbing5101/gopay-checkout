var webpack = require('webpack');
var config  = require('./webpack.config.static');


delete config.devtool;

config.plugins = config.plugins.concat([


  new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('prod'),
        'DEBUG': false
      }
    }),


]);


module.exports = config;



