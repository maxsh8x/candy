"use strict";
const crypto = require("crypto");

const genRandomString = () => crypto.randomBytes(10).toString('hex');
// Thanks to https://gist.github.com/jed/982883#gistcomment-1866201
const genUUID = a => a ? (a ^ Math.random() * 16 >> a / 4)
  .toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11)
  .replace(/[018]/g, genUUID);

module.exports = {genRandomString, genUUID};
