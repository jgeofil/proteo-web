'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var ImagesSchema = new mongoose.Schema({
  data: { type: [
    {
      shortName: String,
      name: String,
      path: String,
      metadata: {},
      gridFile: {type: mongoose.Schema.Types.ObjectId, ref: 'fs.files'}
    }
  ], default: [] },
  stats: {},
  metadata: {},
  path: { type: String, unique: true}
});

var Images = mongoose.model('Images', ImagesSchema);

export default Images
