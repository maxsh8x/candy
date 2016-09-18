/* global describe it*/
"use strict";
const chai = require('chai');
const chaiHttp = require('chai-http');
const dirtyChai = require('dirty-chai');
const chaiJsonSchema = require('chai-json-schema');
const formats = require('tv4-formats');
const expect = chai.expect;

const server = require('../../server');

chai.use(chaiHttp);
chai.use(chaiJsonSchema);
chai.use(dirtyChai);

chai.tv4.addFormat(formats);

const statisticSchema = {
  title: 'getStatistic schema v1',
  type: 'object',
  required: ['tokens'],
  properties: {
    tokens: Number
  }
};

describe('handler /api/statistic', () => {
  it('should return server statistic', done => {
    chai.request(server)
      .get('/api/statistic/')
      .end((err, res) => { // eslint-disable-line handle-callback-err
        expect(res).have.status(200);
        expect(res.body).to.be.jsonSchema(statisticSchema);
        done();
      });
  });
});
