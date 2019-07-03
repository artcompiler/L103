const express = require('express');
const request = require('supertest');
const {expect} = require('chai');
const {app} = require('./../app');
describe('app', () => {
  it('GET /', (done) => {
    request(app)
      .get('/')
      .expect(200, 'Hello, L107!', done);
  });
  it('global.config.unused should be true', () => {
    expect(global.config.unused).to.equal(true);
  });
  it('GET /version', (done) => {
    request(app)
      .get('/version')
      .expect(200, 'v0.0.0', done);
  });
  it('POST /compile', (done) => {
    const body = {
      code: {},
      data: {},
    };
    const encodedBody = JSON.stringify(body);
    request(app)
      .post('/compile')
      .set('Content-type', 'application/json')
      .send(encodedBody)
      .expect(200, null, done);
  });
});
