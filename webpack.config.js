var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'client/compiled');
var APP_DIR = path.resolve(__dirname, 'client');

var config = {
  entry: APP_DIR + '/src/index.js',
  output: {
    path: BUILD_DIR,
    publicPath: '/compiled/',
    filename: 'bundle.js'
  },
  module : {
    loaders : [
      {
        test : /\.jsx?/,
        include : APP_DIR,
        loader : 'babel-loader'
      }
    ]
  },
  performance: {
    hints: process.env.NODE_ENV === 'production' ? 'warning' : false
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    stats: 'errors-only',
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        secure: false
      }
    }
  }
};

module.exports = config;
