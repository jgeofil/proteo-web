'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var ProjectSchema = new mongoose.Schema({
  name: String,
  active: { type: Boolean, default: true },
  path: { type: String, unique: true},
  datasets: { type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Dataset'}], default: [] },
  authorized: {type: Boolean, default: false},
  meta: {}
});

var DatasetSchema = new mongoose.Schema({
  name: String,
  active: { type: Boolean, default: true },
  path: { type: String, unique: true},
  project: {type: mongoose.Schema.Types.ObjectId, ref: 'Project'},
  orfs: { type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Orf'}], default: [] },
  meta: {}
});

var OrfSchema = new mongoose.Schema({
  name: String,
  active: { type: Boolean, default: true },
  path: { type: String, unique: true},
  dataset: {type: mongoose.Schema.Types.ObjectId, ref: 'Dataset'},
  analyses: {},
  meta: {}
});


var Dataset = mongoose.model('Dataset', DatasetSchema);
var Project = mongoose.model('Project', ProjectSchema);
var Orf = mongoose.model('Orf', OrfSchema);

export default {
  Project: Project,
  Dataset: Dataset,
  Orf: Orf
}
