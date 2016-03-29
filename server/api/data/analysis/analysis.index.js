'use strict';

var express = require('express');
var controller = require('./analysis.controller');
var disopred = require('./disopred.controller');
var itasser = require('./itasser.controller');
var tmhmm = require('./tmhmm.controller');
var topcons = require('./topcons.controller');
var util = require('./../util');

var router = express.Router({mergeParams: true});

router.get('/disopred3/', util.fetchMetadataAsync('disopred'), disopred.disopred3);

router.get('/itasser/models', itasser.listModels);
router.get('/itasser/models/:modelName', itasser.getModel);
router.get('/itasser/predictions', util.fetchMetadataAsync('itasser'), itasser.getPredictions);

router.get('/tmhmm/', util.fetchMetadataAsync('tmhmm'), tmhmm.getTmhmm);

router.get('/topcons/', util.fetchMetadataAsync('topcons'), topcons.getTopcons);

router.get('/', controller.index);

module.exports = router;
