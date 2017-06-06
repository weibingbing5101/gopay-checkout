/**
 * @file v2版本的gulp
 */

var gulp = require('gulp');

var logger  = require('../lib/compileLogger');
var webpack = require('webpack');

function compile(callback){
	var env = process.env.NODE_ENV;

	var configUrl = '../../webpack.config.'+env+'.js';
	console.log(configUrl);

	var config = require(configUrl);
	webpack(config, function(err, stats) {
		logger(err, stats)
		callback()
	})
}

gulp.task('webpack', compile);
