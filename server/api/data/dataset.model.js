'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var ProjectSchema = new mongoose.Schema({
  name: { type: String, unique: true},
  active: { type: Boolean, default: true }
});

var DatasetSchema = new mongoose.Schema({
  name: { type: String, unique: true},
  active: { type: Boolean, default: true }
});

var OrfSchema = new mongoose.Schema({
  name: { type: String, unique: true},
  active: { type: Boolean, default: true }
});

export default {
  Project: mongoose.model('Project', ProjectSchema),
  Dataset: mongoose.model('Dataset', DatasetSchema),
  Orf: mongoose.model('Orf', OrfSchema)
}
