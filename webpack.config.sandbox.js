var webpack = require('webpack');
var config  = require('./webpack.config.static');


delete config.devtool;

config.plugins = config.plugins.concat([


  new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('sandbox'),
        'DEBUG': false
      }
    }),


]);


module.exports = config;



