"use strict";
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;

const randomUtils = require('../../utils/random');

const Scope = new Schema(
  {
    _id: {type: String, default: randomUtils.genUUID},
    tags: [String],
    token: {
      type: String,
      ref: 'Token',
      required: true
    },
    containers: [{
      token: {
        type: String,
        ref: 'Token',
        required: true
      },
      container: {
        type: String,
        ref: 'Container',
        required: true
      }
    }]
  },
  {
    timestamps: true,
    id: false
  }
);

module.exports = mongoose.model('Scope', Scope, 'Scope');
