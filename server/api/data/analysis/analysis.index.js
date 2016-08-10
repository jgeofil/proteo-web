'use strict';

var express = require('express');
var controller = require('./analysis.controller');
var disopred = require('./disopred/disopred.controller');
var itasser = require('./itasser/itasser.controller');
var tmhmm = require('./tmhmm/tmhmm.controller');
var topcons = require('./topcons/topcons.controller');

var util = require('./../util');

var router = express.Router({mergeParams: true});

//router.get('/images/', images.getList);
//router.get('/images/:imageName', images.getImages);

//router.get('/models/', models.getList);
//router.get('/models/:modelName', models.getModels);

router.get('/disopred/', util.fetchMetadataAsync('disopred'), disopred.disopred);
router.get('/disopred/file/:fileName', disopred.original);

router.get('/itasser/models', itasser.listModels);
router.get('/itasser/models/:modelName', itasser.getModel);
router.get('/itasser/predictions', util.fetchMetadataAsync('itasser'), itasser.itasser);
router.get('/itasser/predictions/file/:fileName', itasser.original);

router.get('/tmhmm/', util.fetchMetadataAsync('tmhmm'), tmhmm.tmhmm);
router.get('/tmhmm/file/:fileName', tmhmm.original);

router.get('/topcons/', util.fetchMetadataAsync('topcons'), topcons.topcons);
router.get('/topcons/file/:fileName', topcons.original);

router.get('/meta/', util.fetchMetadataAsync(''), controller.metadata);
router.get('/', controller.index);

module.exports = router;
