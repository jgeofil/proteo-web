'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
import Bio from './../bio.model';

var AnalysisSchema = new mongoose.Schema({
  data: {
    sequential: [
      {
        position: {type: Number, required: true, min: 1},
        amino: {type: Bio.Amino, required: true}
      }
    ],
    domains: [
      {
        name: String,
        start: {type: Number, required: true, min: 1},
        end: {type: Number, required: true, min: 1},
      }
    ],
    discrete: {},
    other: {}
  },
  metadata: {},
  originals: [{type: mongoose.Schema.Types.ObjectId, ref: 'Originals'}],
  sequence: String,
  path: String,
  stats: {},
  project: {type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true},
});

AnalysisSchema.pre('validate', function(next) {
  var ANA = this;
  if(!ANA.data) next(new Error('Analysis data is required.'));
  if(!ANA.data.sequential) next(new Error('Analysis data.sequential is required.'));
  next();
});

AnalysisSchema.pre('save', function(next) {
  var ANA = this;
  ANA.data.domains.forEach(function(dom){
    if(dom.end > ANA.data.sequential.length){
      next(new Error('Analysis domain out of bounds.'));
    }
    if(dom.end < dom.start){
      next(new Error('Analysis domain end connot preced start.'));
    }
  })
  next();
});

var Analysis = mongoose.model('Analysis', AnalysisSchema);

export default Analysis;
