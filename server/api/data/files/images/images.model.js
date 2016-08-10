'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

import Files from './../files.model';

var ImagesSchema = new mongoose.Schema({
  name: String
});

var Images = Files.discriminator('Images', ImagesSchema);

export default Images
