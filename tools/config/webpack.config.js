const path = require('path');
module.exports = {
  entry: './build/src/compile.js',
  output: {
    filename: 'compile.js',
    path: path.resolve(__dirname, '../../dist'),
  },
};
