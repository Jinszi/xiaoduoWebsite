const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const webpack = require('webpack')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')

console.log(process.env.NODE_ENV)
const extractLess = new ExtractTextPlugin({
  filename: '[name].[contenthash].css',
  disable: process.env.NODE_ENV === 'development',
})

let webpackConfig = [
  {
    name: 'vendor',
    entry: {
      vendor: [
        'jquery',
        './src/utils/jquery.XDomainRequest.js',
        './src/utils/jquery.waypoints.js',
        './src/utils/jquery.counterup.js',
      ],
    },
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
  },
  {
    name: 'app',
    dependencies: ['vendor'],
    entry: {
      index: './src/pages/index/index.js',
      index_zh_tw: './src/pages/index_zh_tw/index.js',
      index_en_us: './src/pages/index_en_us/index.js',
      about: './src/pages/about/index.js',
      success: './src/pages/success/index.js',
      taobao: './src/pages/taobao/index.js',
      wx: './src/pages/wx/index.js',
      pdd: './src/pages/pdd/index.js',
      expert_service: './src/pages/expert_service/index.js',
      ai_service: './src/pages/ai_service/index.js',
      robot_service: './src/pages/robot_service/index.js',
      robot_phone: './src/pages/robot_phone/index.js',
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
              plugins: ['transform-runtime', 'array-includes'],
            },
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader', 'postcss-loader'],
        },
        {
          test: /\.less$/,
          use: extractLess.extract({
            use: [
              {
                loader: 'css-loader',
              },
              {
                loader: 'postcss-loader',
              },
              {
                loader: 'less-loader',
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
          test: /\.(woff|woff2|eot|ttf|otf|mp3|wma|wav)$/,
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
  },
]

let appConfig = webpackConfig[1]
if (process.env.NODE_ENV === 'development') {
  appConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
  appConfig.devServer = {
    hot: true, // 告诉 dev-server 我们在使用 HMR
    contentBase: path.resolve(__dirname, './'),
    publicPath: '/',
    disableHostCheck: true,
  }
  let entry = appConfig.entry
  for (let page in entry) {
    appConfig.plugins.push(
      new HtmlWebpackPlugin({
        template: `./src/pages/${page}/index.html`,
        filename: `${page}.html`,
        chunks: [page],
      })
    )
  }
  appConfig.plugins.push(
    new HtmlWebpackPlugin({
      template: './src/pages/certification_iso.html',
      filename: 'certification_iso.html',
      chunks: [],
    })
  )
  appConfig.plugins.push(
    new HtmlWebpackPlugin({
      template: './src/pages/certification_cmmi.html',
      filename: 'certification_cmmi.html',
      chunks: [],
    })
  )
  appConfig.plugins.push(
    new AddAssetHtmlPlugin({
      filepath: path.resolve(__dirname, './dist/*.dll.js'),
    })
  )
} else {
  appConfig.output.publicPath = '/dist/'
  appConfig.plugins.push(new CleanWebpackPlugin(['./dist']))
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
    new HtmlWebpackPlugin({
      template: './src/pages/certification_iso.html',
      filename: '../certification_iso.html',
      chunks: [],
    })
  )
  appConfig.plugins.push(
    new HtmlWebpackPlugin({
      template: './src/pages/certification_cmmi.html',
      filename: '../certification_cmmi.html',
      chunks: [],
    })
  )
  appConfig.plugins.push(
    new AddAssetHtmlPlugin({
      filepath: path.resolve(__dirname, './dist/*.dll.js'),
    })
  )
}

module.exports = webpackConfig
