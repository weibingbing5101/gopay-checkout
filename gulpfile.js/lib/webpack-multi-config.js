var config = require('../config_v2')
if(!config.tasks.js) return

var path = require('path')
var webpack = require('webpack')
var webpackManifest = require('./webpackManifest')
var ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = function(env) {
	var jsSrc = path.resolve(config.root.src, config.tasks.js.src)
	var jsDest = path.resolve(config.root.dest, config.tasks.js.dest)
	var publicPath = path.join(config.tasks.js.dest, '/')
	var filenamePattern = env === 'production' ? '[name]-[hash].js' : '[name].js'
	var extensions = config.tasks.js.extensions.map(function(extension) {
		return '.' + extension
	})

	var webpackConfig = {
		context: jsSrc,
		plugins: [],
		resolve: {
			root: jsSrc,
			extensions: [''].concat(extensions)
		},
		plugins: [
			// extract inline css into separate 'styles.css'
			new ExtractTextPlugin('styles.css')
		],
		module: {
			loaders: [
				{
					exclude: /node_modules/,
					test: /\.(js|jsx)$/,
					loader: 'babel-loader',
					query: {
						presets: ['react', 'es2015']
					}
				}
			]
		}
	}

	if(env !== 'test') {
		// Karma doesn't need entry points or output settings
		webpackConfig.entry = './app.js';
		webpackConfig.output= {
			path: path.normalize(jsDest),
			filename: filenamePattern,
			publicPath: publicPath
		}
	}
	if(env === 'development') {
		webpackConfig.devtool = 'source-map'
		webpack.debug = true
	}

	if(env === 'production') {
		webpackConfig.plugins.push(
				new webpackManifest(publicPath, config.root.dest),
				new webpack.DefinePlugin({
					'process.env': {
						'NODE_ENV': JSON.stringify('production')
					}
				}),
				new webpack.optimize.DedupePlugin(),
				new webpack.optimize.UglifyJsPlugin(),
				new webpack.NoErrorsPlugin()
		)
	}
  return webpackConfig;
}