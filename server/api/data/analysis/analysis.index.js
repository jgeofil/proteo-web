'use strict';

var express = require('express');
var controller = require('./analysis.controller');
var disopred = require('./disopred/disopred.controller');
var itasser = require('./itasser/itasser.controller');
var tmhmm = require('./tmhmm/tmhmm.controller');
var topcons = require('./topcons/topcons.controller');

var util = require('./../util');

var router = express.Router({mergeParams: true});

router.get('/disopred/file/:fileName', disopred.original);

//OKID
router.get('/itasser/models/:modelId', itasser.getModel);

router.get('/itasser/predictions/file/:fileName', itasser.original);

router.get('/tmhmm/file/:fileName', tmhmm.original);

router.get('/topcons/file/:fileName', topcons.original);

module.exports = router;
