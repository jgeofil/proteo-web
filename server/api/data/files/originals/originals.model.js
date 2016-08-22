'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

import Files from './../files.model';

var OriginalsSchema = new mongoose.Schema({
  name: String
});

var Originals = Files.discriminator('Originals', OriginalsSchema);

export default Originals
