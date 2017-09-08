var Express = require('express');
var webpack = require('webpack');

var webpackConfig = require('./webpack.wechat.dev.js');

var compiler = webpack(webpackConfig);
var port = 3400;
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

app.listen(port, function onAppListening(err) {
  if (err) {
    console.error(err);
  } else {
    console.info('==> 🚧  Webpack development server listening on port %s', port);
  }
});
