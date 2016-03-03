'use strict';

var express = require('express');
var controller = require('./group.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:id', auth.hasRole('admin'), controller.show);
router.post('/', auth.hasRole('admin'), controller.create);
//router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/:id/adduser', auth.hasRole('admin'), controller.addUser);
router.patch('/:id/addset/:name', auth.hasRole('admin'), controller.addSet);
//router.patch('/:id', controller.update);
router.patch('/:id/remove/:name', auth.hasRole('admin'), controller.removeSet);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
