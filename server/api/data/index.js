'use strict';

var express = require('express');
var controller = require('./data.controller');

var router = express.Router();

router.get('/', controller.index);

router.use('/:dataId/orf', require('./orf.index.js'));

module.exports = router;
