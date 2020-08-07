const webpack = require('webpack'); // 访问内置的插件

module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 300,
      maxSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          // minSize: 300,
          chunks: 'all',
          name: 'lib'
        },
        default: {
          minSize: 0,
          minChunks: 2,
          // priority: -20,
          reuseExistingChunk: true,
          name: 'utils'
        }
      }
    }
  }
};
