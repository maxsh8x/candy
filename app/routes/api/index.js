"use strict";
const router = require('express').Router(); // eslint-disable-line new-cap

router.use('/token', require('./token'));

module.exports = router;
