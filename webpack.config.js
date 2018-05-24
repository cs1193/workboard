const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const configuration = {
  cache: true,
  watch: true,
  context: __dirname,
  entry: {
    app: [
      './example/example.js'
    ]
  },
  devtool: 'source-map',
  resolve: {
    enforceExtension: false,
    extensions: ['.js']
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader',
        query: {
          presets: [
            'stage-0',
            'es2017',
            'env'
          ],
          plugins: [
            'transform-class-properties'
          ]
        }
      }]
    }, {
      test: /\.(css|scss|sass)$/,
      use: ExtractTextPlugin.extract({
        fallback: ['style-loader'],
        use: [{
          loader: 'css-loader',
          options: {
            sourceMap: true
          }
        }, {
          loader: 'resolve-url-loader'
        }, {
          loader: 'sass-loader',
          options: {
            sourceMap: true
          }
        }]
      })
    }, {
      test: /\.html$/,
      use: [{
        loader: 'html-loader'
      }]
    }, {
      test: /\.(jpg|png|woff|woff2|eot|ttf|svg|ico)$/,
      use: [{
        loader: 'file-loader?name=[name]-[hash].[ext]'
      }]
    }, {
      test: /\.(json|geojson)$/,
      use: [{
        loader: 'json-loader'
      }]
    }]
  },
  output: {
    pathinfo: true,
    filename: "[name]-[hash].js",
    path: path.resolve('./dist'),
    publicPath: '/'
  },
  plugins: [
    new ExtractTextPlugin("[name]-[hash].css"),
    new HtmlWebpackPlugin({
      template: './example/example.ejs'
    })
  ]
};

module.exports = configuration;
