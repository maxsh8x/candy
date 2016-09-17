/* global describe before beforeEach it*/
"use strict";
process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const dirtyChai = require('dirty-chai');
const chaiJsonSchema = require('chai-json-schema');
const formats = require('tv4-formats');
const expect = chai.expect;

const config = require('config');
const token = require('../../app/models/token');
const server = require('../../server');

chai.use(chaiHttp);
chai.use(chaiJsonSchema);
chai.use(dirtyChai);
chai.tv4.addFormat(formats);

const tokenSchema = {
  title: 'getToken schema v1',
  type: 'object',
  required: ['token', 'expires', 'isInitiator'],
  properties: {
    token: {
      type: 'string',
      format: 'guid'
    },
    expires: {
      type: 'string',
      format: 'date-time'
    },
    isInitiator: Boolean
  }
};

describe('handlers /api/tokens', () => {
  before(done => {
    if (mongoose.connection.db) {
      return done();
    }
    mongoose.connect(config.MongodbURI, done);
  });
  beforeEach(done => {
    token.remove({}, () => done());
  });
  describe('/first/ GET', () => {
    it('should create and return new token object', done => {
      chai.request(server)
        .get('/api/token/first/')
        .end((err, res) => { // eslint-disable-line handle-callback-err
          expect(res).have.status(200);
          expect(res.body).to.be.jsonSchema(tokenSchema);
          expect(res.body.isInitiator).be.true();
          done();
        });
    });
  });
  describe('/second/ POST', () => {
    it('create second and set flag false to obtained', done => {
      let firstTokenUUID;
      return token.create({isInitiator: true}).then(dbToken => {
        firstTokenUUID = dbToken._id;
        return chai.request(server)
          .post('/api/token/second/')
          .set('content-type', 'application/json')
          .send({token: firstTokenUUID});
      })
        .then(res => {
          expect(res).have.status(200);
          expect(res.body).to.be.jsonSchema(tokenSchema);
          expect(res.body.isInitiator).be.false();
          return token.findById(firstTokenUUID).lean().exec();
        })
        .then(dbToken => {
          expect(dbToken.haveSecondToken).be.false();
          done();
        })
        .catch(done);
    });
  });
});
