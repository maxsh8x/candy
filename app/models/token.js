"use strict";
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;

const tokenUtils = require('../../utils/token');

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
    this._id = tokenUtils.genToken();
  }
  next();
});

module.exports = mongoose.model('token', Token);
