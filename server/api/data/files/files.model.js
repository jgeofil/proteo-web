'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var FilesSchema = new mongoose.Schema({
  gridFile: {type: mongoose.Schema.Types.ObjectId, ref: 'fs.files'},
  metadata: {},
  project: {type: mongoose.Schema.Types.ObjectId, ref: 'Project'}
});

var Files = mongoose.model('Files', FilesSchema);

export default Files;
