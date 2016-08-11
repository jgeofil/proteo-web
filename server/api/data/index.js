'use strict';

var express = require('express');
var controller = require('./data.controller');
var util = require('./util');

import * as auth from '../../auth/auth.service';

var router = express.Router({mergeParams: true});
//OKID
router.post('/update', auth.hasRole('admin'), controller.update);
//OKID
router.use('/files', auth.isAuthenticated(),require('./files/files.index.js'));
//OKID
router.use('/analysis', auth.isAuthenticated(), util.isAuthorizedOnGroup ,require('./analysis/analysis.index.js'));
router.use('/:projectId/dataset/:dataId/orf/:orfId/file/fasta', auth.isAuthenticated(), util.isAuthorizedOnGroup, controller.oneOrfSequence);

//OKID
router.use('/orf/:orfId/full', auth.isAuthenticated(), util.isAuthorizedOnGroup, controller.fullOrf);
//OKID
router.use('/dataset/:dataId', auth.isAuthenticated(), util.isAuthorizedOnGroup, controller.orfs);
//OKID
router.use('/:projectId', auth.isAuthenticated(), util.isAuthorizedOnGroup, controller.datasets);
//OKID
router.get('/', auth.isAuthenticated(), controller.index);

module.exports = router;
