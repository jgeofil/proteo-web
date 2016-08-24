'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var FilesSchema = new mongoose.Schema({
  gridFile: {type: mongoose.Schema.Types.ObjectId, ref: 'fs.files', required: true},
  metadata: {},
  project: {type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true}
});

var Files = mongoose.model('Files', FilesSchema);

export default Files;
