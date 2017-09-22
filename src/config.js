var path = require('path');
//require('babel-polyfill');

const environment = {
	development: {
		isProduction: false
	},
	production: {
		isProduction: true
	}
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign({
	API_ROOT:'/api',
	host: 'localhost',
	port: 7007,
	apiHost: 'localhost',
	apiPort: 7002,
	app: {
		title: '丰盛榜',
		description: 'All the modern best practices in one example.',
		head: {
			titleTemplate: 'Bear Vue Example: %s'
		}
	},
	build: {
    index: path.resolve(__dirname, 'dist/index.html'),
    assetsRoot: path.resolve(__dirname, 'dist'),
    assetsSubDirectory: '/',
    assetsPublicPath: '/',
    productionSourceMap: false
  }
}, environment);
