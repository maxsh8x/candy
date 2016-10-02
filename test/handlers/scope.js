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

const scopeSchema = {
  title: 'getScopesList schema v1',
  type: 'object',
  required: ['_id', 'containers', 'tags', 'createdAt'],
  properties: {
    _id: {
      type: 'string',
      format: 'guid'
    },
    tags: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    containers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          token: {type: 'string'},
          container: {type: 'string'}
        }
      }
    },
    createdAt: 'date-time'
  }
};

// const scopesListSchema = {
//   items: {
//     $ref: '#/definitions/scope'
//   },
//   definitions: {
//     scope: scopeSchema
//   }
// };

describe('handlers /api/scopes', () => {
  before(done => {
    if (mongoose.connection.db) {
      return done();
    }
    mongoose.connect(config.MongodbURI, done);
  });
  beforeEach(done => {
    token.remove({}, () => done());
  });

  describe('/create/ POST', () => {
    it('should return details about new created scope', done => {
      let tokenUUID;
      return token.create({isInitiator: true}).then(dbToken => {
        tokenUUID = dbToken._id;
        return chai.request(server)
          .get('/api/scope/create/')
          .set('content-type', 'application/json')
          .set('AuthToken', tokenUUID);
      })
        .then(res => {
          expect(res).have.status(200);
          expect(res.body).to.be.jsonSchema(scopeSchema);
          done();
        })
        .catch(done);
    });
  });
});
