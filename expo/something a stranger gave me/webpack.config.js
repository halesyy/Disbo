var path = require('path');
var webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports={
  devtool: 'source-map',
  entry: ['./src/App.ts'],
  output:{
    path: path.resolve(__dirname, 'public/build'),
    filename: 'build.js',
    publicPath: '/build/'
  },
  module:{
    loaders:[
      {
        test:/\.ts$/,
        include: path.resolve(__dirname, "src"),
        loader: 'ts-loader'
      },
      {
        test: /\.png$/,
        loader: "url-loader?mimetype=image/png"
      }
    ]
  },
  resolve:{
    alias: {
      vue: 'vue/dist/vue.js'
    },
    extensions: [".webpack.js", ".web.js", ".ts", ".js"]
  }
}
