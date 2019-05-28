const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const routes = require('./routes');
const {createAuth} = require('./lib/auth.js');
const compiler = require("./lib/compile.js");
const createApp = function createApp(compiler) {
  const auth = createAuth(compiler);
  const app = express();
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({ extended: false, limit: 100000000 }));
  app.use(bodyParser.text({limit: '50mb'}));
  app.use(bodyParser.raw({limit: '50mb'}));
  app.use(bodyParser.json({limit: '50mb' }));
  app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.sendStatus(500);
  });
  app.use(express.static(path.resolve(__dirname, './pub')));
  app.get('/', routes.lang(compiler));
  app.get('/version', routes.version(compiler));
  app.get('/compile', routes.auth(auth, 'compile'), routes.compile(compiler));
  app.post('/compile', routes.auth(auth, 'compile'), routes.compile(compiler));
  return app;
}
const PORT = process.env.PORT || `5${compiler.langID}`;
const app = module.exports = createApp(compiler);
module.exports.compiler = app;
if (!module.parent) {
  process.on('uncaughtException', (err) => console.log('Caught exception: ' + err));
  app.listen(PORT, () => console.log(`Node app is running at localhost: ${PORT}`));
}

