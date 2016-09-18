"use strict";
const token = require('../../models/token');

/**
 * @swagger
 * definition:
 *   GetStatistic:
 *     properties:
 *       tokens:
 *         type: integer
 *         format: uuid
 */

/**
 * @swagger
 * /api/statistic/:
 *   get:
 *     tags:
 *       - Statistic
 *     x-swagger-router-controller: statistic
 *     operationId: getServerStat
 *     description: Show server statistic
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returns statistic
 *         schema:
 *           $ref: '#/definitions/GetStatistic'
 */

module.exports.getServerStat = (req, res) => {
  token.count()
    .then(tokensCount => {
      res.json({tokens: tokensCount});
    })
    .catch(err => {
      res.statusCode = 400;
      res.json({success: false, error: err.toString()});
    });
};
