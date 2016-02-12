'use strict';

var express = require('express');
var controller = require('./data.controller');

var router = express.Router({mergeParams: true});

router.use('/:dataId/orf/:orfId/analysis', require('./analysis/analysis.index.js'));
router.use('/:dataId/orf', controller.orfs);
router.get('/', controller.index);

module.exports = router;
