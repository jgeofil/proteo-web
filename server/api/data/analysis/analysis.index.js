'use strict';

var express = require('express');
var controller = require('./analysis.controller');
var disopred = require('./disopred/disopred.controller');
var itasser = require('./itasser.controller');
var tmhmm = require('./tmhmm/tmhmm.controller');
var topcons = require('./topcons.controller');
var images = require('./images.controller');
var models = require('./models/models.controller');
var util = require('./../util');

var router = express.Router({mergeParams: true});

router.get('/images/', images.getList);
router.get('/images/:imageName', images.getImage);

router.get('/models/', models.getList);
router.get('/models/:modelName', models.getModels);

router.get('/disopred/', util.fetchMetadataAsync('disopred'), disopred.disopred);
router.get('/disopred/file/:fileName', disopred.original);

router.get('/itasser/models', itasser.listModels);
router.get('/itasser/models/:modelName', itasser.getModel);
router.get('/itasser/predictions', util.fetchMetadataAsync('itasser'), itasser.getPredictions);

router.get('/tmhmm/', util.fetchMetadataAsync('tmhmm'), tmhmm.tmhmm);

router.get('/topcons/', util.fetchMetadataAsync('topcons'), topcons.getTopcons);

router.get('/meta/', util.fetchMetadataAsync(''), controller.metadata);
router.get('/', controller.index);

module.exports = router;
