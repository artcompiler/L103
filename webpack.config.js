const path = require('path');
module.exports = {
  entry: {
    compile: './src/compile.js',
    viewer: './src/viewer.jsx',
    auth: './src/auth.js',
  },
  target: 'node',
  mode: 'development',
  devtool: 'source-map',
  context: path.resolve(__dirname, './'),
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './dist'),
    globalObject: 'this',
    libraryTarget: 'umd',
  },
  node: {
    global: true,
    __filename: false,
    __dirname: false,
  },
  module: {
    rules: [
      {
        test: /\.[j|t]sx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js', '.jsx' ],
  },
};
