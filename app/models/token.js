"use strict";
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;

const randomUtils = require('../../utils/random');

const Token = new Schema(
  {
    _id: String,
    isInitiator: Boolean,
    lifetime: Date
  }
);

Token.pre('save', function(next) {
  let lifetime = new Date();
  lifetime.setHours(lifetime.getHours() + 24);
  this.lifetime = lifetime;
  if (this.isNew) {
    this._id = randomUtils.genUUID();
  }
  next();
});

module.exports = mongoose.model('token', Token);
