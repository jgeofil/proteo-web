'use strict';

var express = require('express');

var images = require('./images/images.controller');
var models = require('./models/models.controller');

var router = express.Router({mergeParams: true});

router.get('/images/:fileId', images.getImages);

router.get('/models/:fileId', models.getModels);

module.exports = router;