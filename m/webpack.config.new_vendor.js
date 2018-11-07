/**
 * Created by lilieming@xiaoduotech.com
 * Date 2018/3/13
 * Time 11:38
 */
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const webpack = require('webpack')


const extractLess = new ExtractTextPlugin({
  filename: '[name].[contenthash].css',
  disable: process.env.NODE_ENV === 'development',
})

let webpackConfig = {
  name: 'vendor',
  entry: { vendor: ['jquery', './src/utils/jquery.XDomainRequest.js', './src/utils/jquery.waypoints.js', './src/utils/jquery.counterup.js'] },
  devtool: '#source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].dll.js',
    library: '[name]_[hash]',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015'],
            plugins: ['transform-runtime'],
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]_[hash]',
      path: path.resolve(__dirname, 'webpack_manifest.json'),
    }),
  ],
}


module.exports = webpackConfig
