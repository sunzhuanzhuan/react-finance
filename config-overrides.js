const path = require('path');
const webpack = require('webpack')
// let BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const { injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');
const modifyVars = require('./modifyVars.json')

module.exports = function override(config, env) {
	// config = injectBabelPlugin(['import', { libraryName: 'antd', style: 'css' }], config);
    /*config = injectBabelPlugin(['import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true
    }], config);*/
	config = injectBabelPlugin(['lodash'], config);
	config = injectBabelPlugin(['transform-decorators-legacy'], config);
	// config = injectBabelPlugin(['syntax-dynamic-import'], config);
	config = rewireLess.withLoaderOptions({ modifyVars, javascriptEnabled: true })(config, env);
	config.resolve.alias['@'] = path.join(__dirname, 'src')
	/*if (env === 'production') {
		config.plugins = config.plugins.map(item => {
			if (item.options && item.options.compress) {
				item.options.compress.drop_debugger = true;
				item.options.compress.drop_console = true;
			}
			return item;
		})
		let obj = {};
		obj.main = config.entry
		obj.vendor = ['react', 'react-dom', 'echarts','react-redux', 'react-router', 'react-router-dom', 'redux', 'moment', 'antd', path.join(__dirname, 'src', 'index.less'), 'babel-polyfill']
		// 去除 build 时的 eslint 校验
		config.module.rules.shift();
		config.entry = obj
		config.plugins.push(
			new BundleAnalyzerPlugin({
				analyzerMode: 'static'
			}),
			new webpack.optimize.CommonsChunkPlugin({
				name: 'vendor'
			}),
			new webpack.optimize.CommonsChunkPlugin({
				name: 'manifest',
				chunks: ['vendor']
			})
		)
		return config;
	}
	*/

	if (env === 'production') {
		config.plugins = config.plugins.map(item => {
			if (item.options && item.options.compress) {
				item.options.compress.drop_debugger = true;
				item.options.compress.drop_console = true;
			}
			return item;
		})
		config.module.rules[1].oneOf[1].options.limit = 1024
		// 去除 build 时的 eslint 校验
		config.module.rules.shift();

		// 打包测试
		/*config.plugins.push(
			new BundleAnalyzerPlugin({
				analyzerMode: 'static'
			})
		)*/

		config.plugins.push(
			new webpack.DllReferencePlugin({
				context: __dirname,
				manifest: require('./public/vendors-manifest.json')
			})
		);

	}
	if (env === `development`) {
		// 修改eslint配置文件, 使用自定义配置
		config.module.rules[0].use[0].options = {
			useEslintrc: true
		};
	}

	// 忽略的包
	config.externals = {
		echarts: 'echarts'
	}

	return config;
};
