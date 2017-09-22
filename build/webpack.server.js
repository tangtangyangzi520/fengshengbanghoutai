var path = require('path')
var Express = require('express');
var webpack = require('webpack');
var config = require('../src/config.js');
var webpackConfig = require('./webpack.config.js');
var compiler = webpack(webpackConfig);
var port = (config.port) || 3000;
var serverOptions = {
  contentBase: 'http://0.0.0.0' + ':' + port,
  quiet: false,
  noInfo: false,
  hot: true,
  inline: true,
  lazy: false,
  publicPath: webpackConfig.output.publicPath,
  stats: {colors: true},
  headers: {'Access-Control-Allow-Origin': '*'}
};

var app = new Express();

app.use(require('webpack-dev-middleware')(compiler, serverOptions));
app.use(require('webpack-hot-middleware')(compiler));
// serve pure static assets
var staticPath = path.posix.join(config.build.assetsPublicPath, config.build.assetsSubDirectory)
app.use(staticPath, Express.static('./'))
app.listen(port, function onAppListening(err) {
  if (err) {
    console.error(err);
  } else {
    console.info('==> 🚧  Webpack development server listening on port %s', port);
  }
});
