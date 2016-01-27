'use strict';

var express = require('express');
var controller = require('./analysis.controller');
var disopred = require('./disopred.controller');
var itasser = require('./itasser.controller');
var tmhmm = require('./tmhmm.controller');

var router = express.Router({mergeParams: true});

router.get('/', controller.index);

router.get('/disopred3/', disopred.disopred3);

router.get('/itasser/models', itasser.listModels);
router.get('/itasser/models/:modelName', itasser.getModel);
router.get('/itasser/predictions', itasser.getPredictions);

router.get('/tmhmm/', tmhmm.getTmhmm);

module.exports = router;
