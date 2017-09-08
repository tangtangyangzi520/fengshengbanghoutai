var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var projectRootPath = path.resolve(__dirname, '../');
var assetsPath = path.resolve(projectRootPath, './dist');
var CleanPlugin = require('clean-webpack-plugin');

var SOURCE_MAP = false

function generateExtractLoaders (loaders) {
  return loaders.map(function (loader) {
    return loader + '-loader' + (SOURCE_MAP ? '?sourceMap' : '')
  }).join('!')
}
module.exports = {
  devtool:SOURCE_MAP ? 'source-map' : false,
  entry: {
    vendor: ['vue','vuex','vue-router','vue-resource','vuex-router-sync','vux-xscroll','fastclick'],
    bundle: './src/index'
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[hash:8].[name].js',
    publicPath: './'
  },
  plugins: [
    new CleanPlugin([assetsPath], { root: projectRootPath }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false,  // remove all comments
      },
      compress: { warnings: false }
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      //filename:"vendor.js",
      minChunks: Infinity //Infinity
    }),
    new ExtractTextPlugin('[hash:8].style.css', { allChunks: true }),
    new webpack.optimize.DedupePlugin(),
    new HtmlWebpackPlugin({
      favicon:path.join(__dirname,'../src/assets/favicon.ico'),
      title: "",
      template: path.join(__dirname,'../src/template.html'),  //模板文件
      inject:'body',
      hash:false,    //为静态资源生成hash值
      minify:{    //压缩HTML文件
        removeComments:false,    //移除HTML中的注释
        collapseWhitespace:true    //删除空白符与换行符
      }
    }),
  ],
  module: {
    // preLoaders: [
    //   { test: /\.js$/, loader: "eslint-loader", exclude: /node_modules/ }
    // ],
    loaders: [
      { test: /\.vue$/,loader: 'vue', include: path.join(__dirname,'../src')},
      { test: /\.js$/, loader: 'babel', exclude: /node_modules|vue\/dist|vue-hot-reload-api|vue-router\/|vue-loader/},
      { test: /\.(jpe?g|png|gif)$/i, loaders: [
        'url?limit=5120&name=images/[hash:8].[name].[ext]',
        'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}'
      ]},
      { test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url?limit=10000&name=fonts/[hash:8].[name].[ext]'}
    ]
  },
  vue: {
    loaders: {
      js: 'babel',
      css: ExtractTextPlugin.extract('vue-style-loader', generateExtractLoaders(['css'])),
      less: ExtractTextPlugin.extract('vue-style-loader', generateExtractLoaders(['css', 'less'])),
      sass: ExtractTextPlugin.extract('vue-style-loader', generateExtractLoaders(['css', 'sass'])),
      stylus: ExtractTextPlugin.extract('vue-style-loader', generateExtractLoaders(['css', 'stylus']))
    }

  },
  resolve: {
    extensions: ['', '.js', '.vue'],
    alias: {
      'src': path.resolve(__dirname, '../src')
    }
  },
}