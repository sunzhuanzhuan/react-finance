const os = require('os')
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

module.exports = {
	createHappyPlugin: (id, loaders) => new HappyPack({
		id: id,
		loaders: loaders,
		threadPool: happyThreadPool,
		verbose: process.env.HAPPY_VERBOSE === '1' // make happy more verbose with HAPPY_VERBOSE=1
	})
}
