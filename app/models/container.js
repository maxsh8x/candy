"use strict";
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;

const randomUtils = require('../../utils/random');

const Container = new Schema(
  {
    _id: String,
    tags: [String],
    type: {
      type: String,
      enum: ['image', 'text', 'video', 'music'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    created: Date
  }
);

Container.pre('save', function(next) {
  if (this.isNew) {
    this.created = new Date();
    this._id = randomUtils.genUUID();
  }
  next();
});

module.exports = mongoose.model('Container', Container, 'Container');
