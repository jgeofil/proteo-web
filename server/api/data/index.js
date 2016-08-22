'use strict';

var express = require('express');
var controller = require('./data.controller');

import * as auth from '../../auth/auth.service';

var router = express.Router({mergeParams: true});

router.post('/update', auth.hasRole('admin'), controller.update);
router.use('/files', auth.isAuthenticated(), require('./files/files.index.js'));
router.get('/list', auth.hasRole('admin'), controller.listFolders);
router.get('/list/projects', auth.hasRole('admin'), controller.listProjects);
router.get('/list/datasets/:projectId', auth.hasRole('admin'), controller.listDatasets);
router.post('/add/project/:folderName', auth.hasRole('admin'), controller.addProject);
router.post('/add/dataset/:folderName/to/:projectId', auth.hasRole('admin'), controller.addDataset);
router.post('/add/orf/:folderName/to/:datasetId', auth.hasRole('admin'), controller.addOrf);
router.use('/orf/:orfId/fasta', auth.isAuthenticated(), controller.oneOrfSequence);
router.use('/orf/:orfId/full', auth.isAuthenticated(), controller.fullOrf);
router.use('/dataset/:dataId', auth.isAuthenticated(), controller.orfs);
router.use('/:projectId', auth.isAuthenticated(), controller.datasets);
router.get('/', auth.isAuthenticated(), controller.index);


module.exports = router;
