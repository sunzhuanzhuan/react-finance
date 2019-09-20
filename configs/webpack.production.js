const merge = require('webpack-merge')
const baseConfig = require('./webpack.base')
const path = require("path");

const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CleanWebpackPlugin = require("clean-webpack-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const cssnano = require('cssnano');

module.exports = merge(baseConfig, {
	mode: 'production',
	module: {
		rules: [
			{
				test: /\.(less|css)$/,
				use: [
					MiniCssExtractPlugin.loader,
					"css-loader",
					{
						loader: 'less-loader', // compiles Less to CSS
						options: {
							modifyVars: {
								'primary-color': '#1890ff',
								'link-color': '#1890ff',
							},
							javascriptEnabled: true,
						},
					}
				]
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: "static/css/[name].css",
			chunkFilename: "static/css/[id].css"
		}),
		new CleanWebpackPlugin(["build"], {
			root: path.resolve(__dirname, "../"),
			verbose: true
		}),
		new OptimizeCssAssetsPlugin({
			cssProcessor: cssnano,
			cssProcessorOptions: {
				discardComments: {
					removeAll: true
				}
			}
		}),
		// new BundleAnalyzerPlugin()
	]
})
