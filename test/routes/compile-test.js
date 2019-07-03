const bodyParser = require('body-parser');
const {expect} = require('chai');
const express = require('express');
const request = require('supertest');

const routes = require('./../../routes');

describe('routes', () => {
  describe('compile', () => {
    let called;
    let app;
    beforeEach('Setup app', () => {
      called = 0;
      const compiler = {
        compile: function(code, data, config, resume) {
          called++;
          resume(null, null);
        }
      };

      app = express();
      app.use(bodyParser.json({type: "application/json", limit: '50mb' }));
      app.post('/compile', routes.compile(compiler));
    });

    it('should return 400 for bad body', (done) => {
      request(app)
        .post('/compile')
        .set('Content-type', 'text/plain')
        .send('bad body')
        .expect(400, 'Bad Request', done);
    });

    it('should return 400 for no data', (done) => {
      request(app)
        .post('/compile')
        .set('Content-type', 'application/json')
        .send({})
        .expect(400, 'Bad Request', done);
    });

    it('should return 400 for no code', (done) => {
      request(app)
        .post('/compile')
        .set('Content-type', 'application/json')
        .send(JSON.stringify({data: {}}))
        .expect(400, 'Bad Request', done);
    });
  });
});
