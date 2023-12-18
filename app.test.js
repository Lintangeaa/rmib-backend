const request = require('supertest');
const app = require('./app');

describe('Test example', () => {
  test('GET /', (done) => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZmMGMwOWJiLTE5ZWYtNDg1Ny1hNWM2LWFkM2VjNGQ4NDRjZCIsInVzZXJuYW1lIjoibGludGFuZyIsImVtYWlsIjoibGluZHByYWtAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzAwMjQ0ODM0LCJleHAiOjE3MDAyNTU2MzR9.4R1Ij3ZxAbX6P1yvY39L9VIGmDj62cxDgiapA3Byrds';

    request(app)
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        res.body.data.length = 1;
        res.body.data[0].email = 'test@example.com';
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });
});
