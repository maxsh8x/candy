"use strict";
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;

const randomUtils = require('../../utils/random');

const Group = new Schema(
  {
    _id: String,
    tags: [String],
    token: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Token',
      required: true
    },
    containers: [{
      token: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Token',
        required: true
      },
      container: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Container',
        required: true
      }
    }]
  }
);

Group.pre('save', function(next) {
  if (this.isNew) {
    this._id = randomUtils.genUUID();
  }
  next();
});

module.exports = mongoose.model('Group', Group, 'Group');
