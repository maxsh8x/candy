"use strict";
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;

const randomUtils = require('../../utils/random');

const Token = new Schema(
  {
    _id: {type: String, default: randomUtils.genUUID},
    container: {
      type: 'string',
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
  },
  {
    timestamps: true,
    id: false
  }
);

Token.virtual('scopes', {
  ref: 'Scope',
  localField: '_id',
  foreignField: 'token'
});

module.exports = mongoose.model('Token', Token, 'Token');
