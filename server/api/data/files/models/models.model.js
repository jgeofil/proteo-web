'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

import Files from './../files.model';

var ModelsSchema = new mongoose.Schema({
  name: String
});

var Models = Files.discriminator('Models', ModelsSchema);

export default Models
