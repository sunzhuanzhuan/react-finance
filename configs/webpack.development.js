const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base')

module.exports = merge(baseConfig, {
	mode: 'development',
	devtool: 'inline-source-map',
	devServer: {
		port: '7000',
		historyApiFallback: true,
		compress: true,
		open: true,
		hot: true,
		host: 'lg.nip.io',
		proxy: {
			// "/api/trinity": {
			// 	target: "http://192.168.20.128:8010", 192.168.100.117:30002
			// 	changeOrigin: true
			// },
			// "/api/common-price/finance": {
			// 	target: "http://172.16.21.179:19094",
			// 	changeOrigin: true
			// },
			"/api": {
				target: "http://nb.tst-weiboyi.com",
				changeOrigin: true
			}
		},
	},
	module: {
		rules: [
			{
				enforce: 'pre',
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: "eslint-loader",
			},
			{
				test: /\.(less|css)$/,
				use: [
					'css-hot-loader',
					'style-loader',
					'css-loader',
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
				],
			},
		],
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': '"development"',
		}),
		new webpack.HotModuleReplacementPlugin()
	]
})
