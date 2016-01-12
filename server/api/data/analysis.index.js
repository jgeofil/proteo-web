'use strict';

var express = require('express');
var controller = require('./analysis.controller');

var router = express.Router({mergeParams: true});

router.get('/', controller.index);

module.exports = router;
