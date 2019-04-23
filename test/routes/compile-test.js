const bodyParser = require('body-parser');
const {expect} = require('chai');
const express = require('express');
const request = require('supertest');

const routes = require('./../../src/routes');

describe('routes', () => {
  describe('compile', () => {
    let called;
    let app;
    beforeEach('Setup app', () => {
      called = 0;
      const compiler = {
        compile: function(code, data, resume) {
          called++;
          resume(null, null);
        }
      };

      app = express();
      app.use(bodyParser.urlencoded({ extended: false, limit: 100000000 }));
      app.use(bodyParser.text({limit: '50mb'}));
      app.use(bodyParser.raw({limit: '50mb'}));
      app.use(bodyParser.json({limit: '50mb' }));
      app.get('/compile', routes.compile(compiler));
    });

    it('should call compile function', (done) => {
      request(app)
        .get('/compile')
        .set('Content-type', 'text/plain')
        .send(JSON.stringify({src: {}, data: {}}))
        .expect(200, 'null')
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(called).to.equal(1);
          done();
        });
    });

    it('should return 400 for bad body', (done) => {
      request(app)
        .get('/compile')
        .set('Content-type', 'text/plain')
        .send('bad body')
        .expect(400, 'Bad Request', done);
    });

    it('should return 400 for json body', (done) => {
      request(app)
        .get('/compile')
        .send({src: {}, data: {}})
        .expect(400, 'Bad Request', done);
    });

    it('should return 400 for no data', (done) => {
      request(app)
        .get('/compile')
        .set('Content-type', 'text/plain')
        .send(JSON.stringify({src: {}}))
        .expect(400, 'Bad Request', done);
    });

    it('should return 400 for no code', (done) => {
      request(app)
        .get('/compile')
        .set('Content-type', 'text/plain')
        .send(JSON.stringify({data: {}}))
        .expect(400, 'Bad Request', done);
    });
  });
});
