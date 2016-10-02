"use strict";
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;

const randomUtils = require('../../utils/random');

const Container = new Schema(
  {
    _id: {type: String, default: randomUtils.genUUID},
    tags: [String],
    type: {
      type: String,
      enum: ['image', 'text', 'video', 'music'],
      required: true
    },
    content: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Container', Container, 'Container');
