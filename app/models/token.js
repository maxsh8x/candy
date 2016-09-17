"use strict";
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;

const randomUtils = require('../../utils/random');

const Token = new Schema(
  {
    _id: String,
    isInitiator: Boolean,
    expires: Date
  }
);

Token.pre('save', function(next) {
  let expires = new Date();
  expires.setHours(expires.getHours() + 24);
  this.expires = expires;
  if (this.isNew) {
    this._id = randomUtils.genUUID();
  }
  next();
});

module.exports = mongoose.model('token', Token);
