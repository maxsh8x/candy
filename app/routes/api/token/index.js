const router = require('express').Router(); // eslint-disable-line new-cap

/**
 * @swagger
 * definition:
 *   Token:
 *     properties:
 *       token:
 *         type: string
 *       lifetime:
 *         type: string
 *         format: date-time
 */

/**
 * @swagger
 * /api/token/get:
 *   get:
 *     tags:
 *       - Tokens
 *     description: Returns a new token
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A single token
 *         schema:
 *           $ref: '#/definitions/Token'
 */
router.get('/get', require('./crud').getToken);

module.exports = router;
