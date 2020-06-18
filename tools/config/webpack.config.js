const path = require('path');
module.exports = {
  target: 'node',
  mode: 'development',
  devtool: 'source-map',
  entry: './build/src/compile.js',
  context: path.resolve(__dirname, '../../'),
  output: {
    filename: 'compile.js',
    path: path.resolve(__dirname, '../../dist'),
    globalObject: 'this',
    libraryTarget: 'umd',
  },
  node: {
    global: true,
    __filename: false,
    __dirname: false,
  },
};
