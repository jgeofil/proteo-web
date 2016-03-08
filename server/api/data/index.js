'use strict';

var express = require('express');
var controller = require('./data.controller');
var util = require('./util');

import * as auth from '../../auth/auth.service';

var router = express.Router({mergeParams: true});

router.use('/:dataId/orf/:orfId/analysis', auth.isAuthenticated(), util.isAuthorizedOnGroup ,require('./analysis/analysis.index.js'));
router.use('/:dataId/orf', auth.isAuthenticated(), util.isAuthorizedOnGroup, controller.orfs);
router.get('/', auth.isAuthenticated(), controller.index);

module.exports = router;
