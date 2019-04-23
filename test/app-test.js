const request = require('supertest');

const app = require('./../index.js');

describe('app', () => {
  it('GET /', (done) => {
    request(app)
      .get('/')
      .expect(200, 'Hello, L107!', done);
  });
  
  it('GET /version', (done) => {
    request(app)
      .get('/version')
      .expect(200, 'v0.0.0', done);
  });

  it('GET /compile', (done) => {
    const body = {
      src: {},
      data: {},
    };
    const encodedBody = JSON.stringify(body);
    request(app)
      .get('/compile')
      .set('Content-type', 'text/plain')
      .send(encodedBody)
      .expect(200, 'null', done);
  });
});
