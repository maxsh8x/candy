/* global describe before beforeEach it*/
"use strict";
process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

const config = require('config');
const token = require('../app/models/token');
const tokenUtils = require('../utils/token');
const server = require('../server');

chai.use(chaiHttp);
describe('Tokens', function() {
  before(function(done) {
    if (mongoose.connection.db) {
      return done();
    }
    mongoose.connect(config.DBHost, done);
  });
  beforeEach(function(done) {
    token.remove({}, function() {
      done();
    });
  });
  describe('genToken', function() {
    it('it should generate token', function(done) {
      const firstToken = tokenUtils.genToken();
      const secondToken = tokenUtils.genToken();
      expect(firstToken).be.a('string');
      expect(firstToken.length).be.eql(20);
      expect(firstToken.length).be.eql(20);
      expect(secondToken).be.a('string');
      expect(secondToken.length).be.eql(20);
      expect(secondToken.length).be.eql(20);
      expect(firstToken).to.not.equal(secondToken);
      done();
    });
  });
  describe('/GET token', function() {
    it('it should GET new token object', function(done) {
      chai.request(server)
        .get('/api/token/get/')
        .end(function(err, res) {
          expect(res).have.status(200);
          expect(res.body).be.a('object');
          expect(res.body).have.property('token');
          expect(res.body).have.property('lifetime');
          done();
        });
    });
  });
});
