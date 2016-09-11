"use strict";
const crypto = require("crypto");

const genToken = () => crypto.randomBytes(10).toString('hex');

module.exports = {genToken};

