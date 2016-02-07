const webpack = require('webpack');
const path = require('path');
const isDev = true;

const defineConstPlugin = new webpack.DefinePlugin({
  __DEV__: isDev,
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
});

module.exports = {
  devtool: 'cheap-module-eval-source-map',

  entry: [
    'babel-polyfill',
    'webpack-hot-middleware/client',
    './src/index',
  ],

  output: {
    path: path.join(__dirname, 'dist', 'static'),
    filename: 'bundle.js',
    publicPath: '/static/',
  },

  plugins: [
    defineConstPlugin,
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],

  module: {
    loaders: [{
      test: /\.js$/,
      loaders: [ 'babel' ],
      include: path.join(__dirname, 'src'),
    }, {
      test: /\.(png|jpg)$/,
      loader: 'url-loader?limit=8192',
    }],
  },
};
