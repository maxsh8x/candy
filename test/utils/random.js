/* global describe it*/

const randomUtils = require('../../utils/random');
const chai = require('chai');
const expect = chai.expect;

describe('utils -> random', () => {
  it('getRandomString() it should generate random string', done => {
    const firstToken = randomUtils.genRandomString();
    const secondToken = randomUtils.genRandomString();
    expect(firstToken).be.a('string');
    expect(firstToken.length).be.eql(20);
    expect(secondToken).be.a('string');
    expect(secondToken.length).be.eql(20);
    expect(firstToken).to.not.equal(secondToken);
    done();
  });
});
