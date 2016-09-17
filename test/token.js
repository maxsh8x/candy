/* global describe before beforeEach it*/
"use strict";
process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiJsonSchema = require('chai-ajv-json-schema');
const expect = chai.expect;

const config = require('config');
const token = require('../app/models/token');
const randomUtils = require('../utils/random');
const server = require('../server');

chai.use(chaiHttp);
chai.use(chaiJsonSchema);

describe('Tokens', function() {
  before(function(done) {
    if (mongoose.connection.db) {
      return done();
    }
    mongoose.connect(config.MongodbURI, done);
  });
  beforeEach(function(done) {
    token.remove({}, function() {
      done();
    });
  });
  describe('genToken', function() {
    it('it should generate token', function(done) {
      const firstToken = randomUtils.genRandomString();
      const secondToken = randomUtils.genRandomString();
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
        .end(function(err, res) { // eslint-disable-line handle-callback-err
          const getTokenSchema = {
            title: 'getToken schema v1',
            type: 'object',
            required: ['token', 'lifetime'],
            properties: {
              token: {
                type: 'string',
                format: 'uuid'
              },
              lifetime: {
                type: 'string',
                format: 'date-time'
              }
            }
          };
          expect(res).have.status(200);
          expect(res.body).to.be.validWithSchema(getTokenSchema);
          done();
        });
    });
  });
});
