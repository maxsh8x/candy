/* global describe before beforeEach it*/
"use strict";
process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const dirtyChai = require('dirty-chai');
const chaiJsonSchema = require('chai-json-schema');
const expect = chai.expect;

const config = require('config');
const token = require('../../app/models/token');
const server = require('../../server');

chai.use(chaiHttp);
chai.use(chaiJsonSchema);
chai.use(dirtyChai);

const serverStatSchema = {
  title: 'getServerStat schema v1',
  type: 'object',
  required: ['tokens'],
  properties: {
    tokens: {
      type: 'integer'
    }
  }
};

describe('handlers /api/statistic', () => {
  before(done => {
    if (mongoose.connection.db) {
      return done();
    }
    mongoose.connect(config.MongodbURI, done);
  });
  beforeEach(done => {
    token.remove({}, () => done());
  });
  it('should return server metrics', done => {
    chai.request(server)
      .get('/api/statistic/')
      .end((err, res) => { // eslint-disable-line handle-callback-err
        expect(res).have.status(200);
        expect(res.body).to.be.jsonSchema(serverStatSchema);
        done();
      });
  });
});
