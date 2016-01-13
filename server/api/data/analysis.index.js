'use strict';

var express = require('express');
var controller = require('./analysis.controller');
var disopred = require('./analysis/disopred.controller');
var itasser = require('./analysis/itasser.controller');

var router = express.Router({mergeParams: true});

router.get('/', controller.index);

router.get('/disopred3/', disopred.disopred3);

router.get('/itasser/models', itasser.listModels);
router.get('/itasser/models/:modelName', itasser.getModel);

module.exports = router;
