"use strict";
const scope = require('../../models/scope');
const jsonUtils = require('../../../utils/json');

/**
 * @swagger
 * definition:
 *   CreateScope:
 *     properties:
 *       _id:
 *         type: string
 *         format: uuid
 *       token:
 *         type: string
 *         format: uuid
 *       createdAt:
 *         type: string
 *         format: date-time
 */

/**
 * @swagger
 * /api/scope/create/:
 *   get:
 *     tags:
 *       - Scopes
 *     x-swagger-router-controller: scope
 *     operationId: createScope
 *     security:
 *       - accessToken: []
 *     description: Create new scope
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Scope created, return scope
 *         schema:
 *           $ref: '#/definitions/CreateScope'
 */

module.exports.createScope = (req, res) => {
  scope.create({token: req.user._id})
    .then(scope => {
      const fields = ['_id', 'token', 'containers', 'tags', 'createdAt'];
      res.json(jsonUtils.getResponse(scope, fields));
    })
    .catch(err => {
      res.statusCode = 400;
      res.json({success: false, error: err.toString()});
    });
};
