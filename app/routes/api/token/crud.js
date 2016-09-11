"use strict";
const Token = require('../../../models/token');

module.exports.getToken = function getToken(req, res) {
  Token.create({isInitiator: true})
    .then((token, err) => {
      if (err) {
        res.send(err);
      }
      const result = {
        token: token._id,
        lifetime: token.lifetime
      };
      res.json(result);
    });
};

