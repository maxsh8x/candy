"use strict";
const Promise = require("bluebird");

const token = require('../../models/token');

/**
 * @swagger
 * definition:
 *   GetToken:
 *     properties:
 *       token:
 *         type: string
 *         format: uuid
 *       expires:
 *         type: string
 *         format: date-time
 *       isInitiator:
 *         type: boolean
 *       haveSecondToken:
 *         type: boolean
 *   ForSecondToken:
 *     type: object
 *     required:
 *       - token
 *     properties:
 *       token:
 *         type: string
 *         format: uuid
 */

/**
 * @swagger
 * /api/token/first/:
 *   get:
 *     tags:
 *       - Tokens
 *     x-swagger-router-controller: token
 *     operationId: getFirstToken
 *     description: Returns a new first token for you
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A single token
 *         schema:
 *           $ref: '#/definitions/GetToken'
 */

const getTokenSchema = token => {
  return {
    token: token._id,
    expires: token.expires,
    isInitiator: token.isInitiator,
    haveSecondToken: token.haveSecondToken
  };
};

module.exports.getFirstToken = (req, res) => {
  token.create({isInitiator: true})
    .then(token => {
      res.json(getTokenSchema(token));
    })
    .catch(err => {
      res.statusCode = 400;
      res.json({success: false, error: err.toString()});
    });
};

/**
 * @swagger
 * /api/token/second/:
 *   post:
 *     tags:
 *       - Tokens
 *     x-swagger-router-controller: token
 *     operationId: getSecondToken
 *     parameters:
 *       - name: token
 *         in: body
 *         description: Your first uuid
 *         schema:
 *           $ref: '#/definitions/ForSecondToken'
 *     description: Returns a second token that you can share
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A single token
 *         schema:
 *           $ref: '#/definitions/GetToken'
 */

module.exports.getSecondToken = (req, res) => {
  token.findById(req.body.token)
    .then(dbToken => {
      if (!dbToken) {
        return Promise.reject('token not found');
      }
      if (!dbToken.haveSecondToken) {
        return Promise.reject('no tokens');
      }
      dbToken.haveSecondToken = false;
      return Promise.all([
        token.create({}),
        dbToken.save()
      ]);
    })
    .then(([secondToken]) => {
      res.json(getTokenSchema(secondToken));
    })
    .catch(err => {
      res.statusCode = 400;
      res.json({success: false, error: err.toString()});
    });
};
