var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var host =  'localhost';
var port =  require('../src/config.js').port;
var projectRoot = path.resolve(__dirname, '../')
var SOURCE_MAP = false
function generateExtractLoaders (loaders) {
  return loaders.map(function (loader) {
    return loader + '-loader' + (SOURCE_MAP ? '?sourceMap' : '')
  }).join('!')
}
module.exports = {
  devtool: 'inline-source-map',
  debug: true,
  entry: [
    'webpack-hot-middleware/client?path=http://' + host + ':' + port + '/__webpack_hmr',
    './src/index.js'
  ],
  output: {
    path: process.cwd(),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
      favicon:path.join(__dirname,'../src/assets/favicon.ico'),
      title: "丰盛榜",
      template: path.join(__dirname,'../src/template.html'),
      inject: true
    }),
    new ExtractTextPlugin('[hash:8].style.css', { allChunks: true })
  ],
  module: {
    // preLoaders: [
    //   { test: /\.js$/, loader: "eslint-loader", exclude: /node_modules/ }
    // ],
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      { test: /\.css$/, 
        loader: "style-loader!css-loader?root=./assets/" 
      },
      {
        test: /\.less$/,
        loader: "style!css!less"
      },
      {
        test: /\.scss$/, 
        loader: "style!css!sass"
      },
      {
        test: /\.js$/,
        loader: 'babel',
        include: projectRoot,
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.html$/,
        loader: 'vue-html'
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader?limit=8192&name=static/[name].[hash:7].[ext]'
      }
    ]
  },
  progress: true,
  vue: {
    loaders: {
      js: 'babel',
      css: ExtractTextPlugin.extract('vue-style-loader', generateExtractLoaders(['css'])),
      less: ExtractTextPlugin.extract('vue-style-loader', generateExtractLoaders(['css', 'less'])),
      sass: ExtractTextPlugin.extract('vue-style-loader', generateExtractLoaders(['css', 'sass'])),
      stylus: ExtractTextPlugin.extract('vue-style-loader', generateExtractLoaders(['css', 'stylus'])),
    }
  },
  resolve: {
    root: path.resolve(__dirname, 'node_modules'),
    extensions: ['','.js','.vue','.scss']
  }
}