'use strict';

let path = require('path');
let webpack = require('webpack');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let OfflinePlugin = require('offline-plugin');

let PROD = (process.env.NODE_ENV === 'production');

module.exports = function makeWebpackConfig() {
	/**
	 * Config
	 * Reference: http://webpack.github.io/docs/configuration.html
	 * This is the object where all configuration gets set
	 */
	let config = {};

	config.entry = {
		'main': './app/js/main.js'
	};

	config.output = {
		path: path.resolve(__dirname, 'dist/js'),
		filename: '[name].js'
	};

	let extractStyles = new ExtractTextPlugin({
		filename: '../css/[name].css',
		devtool: 'source-map'
	});

	config.plugins = PROD ? [
		extractStyles,
		new webpack.optimize.UglifyJsPlugin({minimize: true}),
		new OfflinePlugin()
	] : [
		extractStyles,
		new OfflinePlugin()
	];

	config.module = {
		rules: [
			{
				test: /\.js$/i,
				loaders: ['babel-loader'],
				exclude: [/node_modules/]
			},
			{
				test: /\.scss$/i,
				loaders: ['style-loader', 'css-loader', 'sass-loader'],
				exclude: /node_modules/
			}
		]
	};

	return config;
}();
