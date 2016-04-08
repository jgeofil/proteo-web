'use strict';

var express = require('express');
var controller = require('./data.controller');
var util = require('./util');

import * as auth from '../../auth/auth.service';

var router = express.Router({mergeParams: true});

router.post('/update', auth.hasRole('admin'), controller.update);
router.use('/:projectId/dataset/:dataId/orf/:orfId/analysis', auth.isAuthenticated(), util.isAuthorizedOnGroup ,require('./analysis/analysis.index.js'));
router.use('/:projectId/dataset/:dataId', auth.isAuthenticated(), util.isAuthorizedOnGroup, controller.orfs);
router.use('/:projectId', auth.isAuthenticated(), util.isAuthorizedOnGroup, controller.datasets);
router.get('/', auth.isAuthenticated(), controller.index);

module.exports = router;
