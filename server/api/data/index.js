'use strict';

var express = require('express');
var controller = require('./data.controller');

import * as auth from '../../auth/auth.service';

var router = express.Router({mergeParams: true});

router.post('/update', auth.hasRole('admin'), controller.update);
router.use('/files', auth.isAuthenticated(), require('./files/files.index.js'));
router.use('/orf/:orfId/fasta', auth.isAuthenticated(), controller.oneOrfSequence);
router.use('/orf/:orfId/full', auth.isAuthenticated(), controller.fullOrf);
router.use('/dataset/:dataId', auth.isAuthenticated(), controller.orfs);
router.use('/:projectId', auth.isAuthenticated(), controller.datasets);
router.get('/', auth.isAuthenticated(), controller.index);

module.exports = router;
