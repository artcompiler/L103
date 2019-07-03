const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const path = require('path');

const routes = require('./routes');
const compiler = require("./lib/compile.js");
const {createAuth} = require('./lib/auth.js');

const auth = createAuth(compiler);
const app = exports.app = express();

global.config = require("./config.json");
const PORT = process.env.PORT || `5${compiler.langID}`;

app.use(morgan('dev'));

// service only accepts json requests
app.use(bodyParser.json({ type: 'application/json', limit: '50mb' }));

// catch and log any errors and return 500s
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.sendStatus(500);
});

// serve up static content from pub
app.use(express.static(path.resolve(__dirname, './pub')));

// app routes
app.get('/', routes.root(compiler));
app.get('/version', routes.version(compiler));
app.get('/:path', routes.lang(compiler));
app.post('/compile', routes.auth(auth, 'compile'), routes.compile(compiler));

// start the dance...
app.listen(PORT, () => console.log(`Node app is running at localhost: ${PORT}`));
