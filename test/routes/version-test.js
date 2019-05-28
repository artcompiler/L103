const request = require('supertest');
const express = require('express');

const routes = require('./../../routes');

describe('routes', () => {
  describe('version', () => {
    it('Return specified compiler version', (done) => {
      const compiler = {
        version: 'v1.2.3'
      };
      const app = express();
      app.get('/version', routes.version(compiler));
      request(app)
        .get('/version')
        .expect(200, 'v1.2.3', done);
    });

    it('Return v0.0.0 when no compiler version', (done) => {
      const compiler = {};
      const app = express();
      app.get('/version', routes.version(compiler));
      request(app)
        .get('/version')
        .expect(200, 'v0.0.0', done);
    });
  });
});
