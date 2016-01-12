'use strict';

var express = require('express');
var controller = require('./orf.controller');

var router = express.Router({mergeParams: true});

router.get('/', controller.index);

router.use('/:orfId/analysis', require('./analysis.index.js'));

module.exports = router;
