'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var ModelSchema = new mongoose.Schema({
  data: { type: [
    {
      shortName: String,
      path: String,
      metadata: {},
      pdbId: {type: mongoose.Schema.Types.ObjectId, ref: 'fs.files'}
    }
  ], default: [] },
  stats: {},
  metadata: {},
  path: { type: String, unique: true}
});

var Model = mongoose.model('Model', ModelSchema);

export default Model
