"use strict";
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;

const randomUtils = require('../../utils/random');

const Token = new Schema(
  {
    _id: String,
    container: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Container'
    },
    isInitiator: {
      type: Boolean,
      default: false
    },
    haveSecondToken: {
      type: Boolean,
      default: true
    },
    expires: Date
  }
);

Token.pre('save', function(next) {
  let expires = new Date();
  expires.setHours(expires.getHours() + 24 * 7);
  this.expires = expires;
  if (this.isNew) {
    this._id = randomUtils.genUUID();
  }
  next();
});

Token.virtual('groups', {
  ref: 'Group',
  localField: '_id',
  foreignField: 'token'
});

module.exports = mongoose.model('Token', Token, 'Token');
