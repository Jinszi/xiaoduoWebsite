const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const webpack = require('webpack')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')

const extractLess = new ExtractTextPlugin({
  filename: '[name].[contenthash].css',
  disable: process.env.NODE_ENV === 'development',
})

console.log(process.env.NODE_ENV)
let webpackConfig = {
  name: 'app',
  dependencies: ['vendor'],
  entry: {
    index: './src/pages/index/index.js',
    index_en_us: './src/pages/index_en_us/index.js',
    index_zh_tw: './src/pages/index_zh_tw/index.js',
    expert_service: './src/pages/expert_service/index.js',
    ai_service: './src/pages/ai_service/index.js',
    robot_service: './src/pages/robot_service/index.js',
    robot_phone: './src/pages/robot_phone/index.js',
    about: './src/pages/about/index.js',
    success: './src/pages/success/index.js',
  },
  output: {
    filename: '[name].bundle.[hash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'stage-0'],
            plugins: ['transform-runtime'],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.less$/,
        use: extractLess.extract({
          use: [
            {
              loader: 'css-loader',
              options: { sourceMap: false },
            },
            {
              loader: 'postcss-loader',
              options: { sourceMap: false },
            },
            {
              loader: 'less-loader',
              options: { sourceMap: false },
            },
          ],
          // use style-loader in development
          fallback: 'style-loader',
        }),
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[md5:hash:hex:6].[ext]',
          },
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|ogg|mp3|wma|wav)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[md5:hash:hex:6].[ext]',
          },
        },
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        options: {
          interpolate: true,
        },
      },
    ],
  },
  devtool: '#source-map',
  plugins: [
    extractLess,
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, 'webpack_manifest.json'),
    }),
  ],
}

let appConfig = webpackConfig
if (process.env.NODE_ENV === 'development') {
  appConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
  appConfig.devServer = {
    hot: true, // 告诉 dev-server 我们在使用 HMR
    host: '0.0.0.0',
    disableHostCheck: true,
    contentBase: path.resolve(__dirname, './'),
    publicPath: '/',
  }

  let entry = appConfig.entry
  for (let page in entry) {
    appConfig.plugins.push(
      new HtmlWebpackPlugin({
        template: `./src/pages/${page}/index.html`,
        filename: `${page}.html`,
        chunks: [page],
        alwaysWriteToDisk: true,
      })
    )
  }
  appConfig.plugins.push(
    new AddAssetHtmlPlugin({
      filepath: path.resolve(__dirname, './dist/*.dll.js'),
    })
  )
  appConfig.plugins.push(new HtmlWebpackHarddiskPlugin())
} else {
  appConfig.output.publicPath = '/m/dist/'
  // appConfig.plugins.push(new CleanWebpackPlugin(['./dist']))
  let entry = appConfig.entry
  for (let page in entry) {
    appConfig.plugins.push(
      new HtmlWebpackPlugin({
        template: `./src/pages/${page}/index.html`,
        filename: `../${page}.html`,
        chunks: [page],
      })
    )
  }
  appConfig.plugins.push(
    new AddAssetHtmlPlugin({
      filepath: path.resolve(__dirname, './dist/*.dll.js'),
    })
  )
}
// 开发环境不导出vendor配置，否则css热替换会失效
/* if (process.env.NODE_ENV === 'development') {
  module.exports = webpackConfig[1]
  console.log('--development--')
  return
}
*/
module.exports = webpackConfig
