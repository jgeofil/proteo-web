'use strict';

var express = require('express');
var controller = require('./analysis.controller');

var router = express.Router({mergeParams: true});

router.get('/', controller.index);
router.get('/disopred3/', controller.disopred3);

module.exports = router;
