var should = require('should');
var request = require('supertest');
var server = require('../../../app');

describe('controllers', function() {
  describe('user', function() {
    describe('PUT /user/create', function() {
     /*  it('should return a success message', function(done) {
        request(server)
          .put('/user/create')
          .query({ name: 'asd', email:'asd@asd.asd', password:'asdasd' })
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(201)
          .end(function(err, res) {
            should.not.exist(err);
            this.timeout(500);
            setTimeout(done, 300);
            res.body.should.eql({success: 'sikeres feltöltés'});

            done();
          });
      });
 */
      /* it('should accept a name parameter', function(done) {
        request(server)
          .get('/hello')
          .query({ name: 'Scott' })
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);

            res.body.should.eql('Hello, Scott!');

            done();
          });
      }); */
    });
  });
});