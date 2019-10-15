// var path = require('path')
// const fs = require('fs');

// module.exports = {
//   // Change to your "entry-point".
//   entry: './src/index',
//   output: {
//     filename: 'dist/index.js'
//   },
//   resolve: {
//     extensions: ['.ts', '.tsx', '.js', '.json']
//   },
//   module: {
//     rules: [
//       {
//         // Include ts, tsx, js, and jsx files.
//         test: /\.(ts|js)x?$/,
//         loader: 'awesome-typescript-loader',
//         exclude: /node_modules/,
//         query: {
//           declaration: false,
//         }
//       }
//     ]
//   }
// }

const path = require('path')
module.exports = {
  entry: {
    'craft-lib': './packages/core/src/index'
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  devtool: 'source-map',
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      sourceMap: true,
      include: /\.min\.js$/,
    })
  ],
  module: {
    loaders: [{
      test: /\.(ts|js)x?$/,
      loader: 'awesome-typescript-loader',
      exclude: /node_modules/,
      query: {
        declaration: false,
      }
    }]
  }
}