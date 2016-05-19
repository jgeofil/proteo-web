'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var path = require('path');

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
  dirname: { type: String, unique: true},
  project: {type: mongoose.Schema.Types.ObjectId, ref: 'Project'},
  orfs: { type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Orf'}], default: [] },
  meta: {}
});

var OrfSchema = new mongoose.Schema({
  name: String,
  active: { type: Boolean, default: true },
  path: { type: String, unique: true},
  dirname: { type: String, unique: true},
  dataset: {type: mongoose.Schema.Types.ObjectId, ref: 'Dataset'},
  analyses: {},
  analysis: {
    disopred: {type: mongoose.Schema.Types.ObjectId, ref: 'Disopred', default: null}
  },
  meta: {}
});

OrfSchema.pre('save', function(next) {
  this.dirname = path.dirname(this.path);
  next();
});

DatasetSchema.pre('save', function(next) {
  this.dirname = path.dirname(this.path);
  next();
});


var Dataset = mongoose.model('Dataset', DatasetSchema);
var Project = mongoose.model('Project', ProjectSchema);
var Orf = mongoose.model('Orf', OrfSchema);

export default {
  Project: Project,
  Dataset: Dataset,
  Orf: Orf
}
