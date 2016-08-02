'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var path = require('path');
var asy = require('async');
import _ from 'lodash';

import Disopred from './analysis/disopred/disopred.model';
import Tmhmm from './analysis/tmhmm/tmhmm.model';
import Topcons from './analysis/topcons/topcons.model';
import Itasser from './analysis/itasser/itasser.model';
import Bio from './bio.model';

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
  dirname: String,
  project: {type: mongoose.Schema.Types.ObjectId, ref: 'Project'},
  orfs: { type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Orf'}], default: [] },
  meta: {}
});

var OrfSchema = new mongoose.Schema({
  name: String,
  active: { type: Boolean, default: true },
  path: { type: String, unique: true},
  dirname: String,
  dataset: {type: mongoose.Schema.Types.ObjectId, ref: 'Dataset'},
  project: {type: mongoose.Schema.Types.ObjectId, ref: 'Project'},
  analyses: {},
  analysis: {
    disopred: {type: mongoose.Schema.Types.ObjectId, ref: 'Disopred', default: null},
    tmhmm: {type: mongoose.Schema.Types.ObjectId, ref: 'Tmhmm', default: null},
    topcons: {type: mongoose.Schema.Types.ObjectId, ref: 'Topcons', default: null},
    itasser: {type: mongoose.Schema.Types.ObjectId, ref: 'Itasser', default: null},
    models: {type: mongoose.Schema.Types.ObjectId, ref: 'Model', default: null},
    images: {type: mongoose.Schema.Types.ObjectId, ref: 'Images', default: null}
  },
  sequence: [String],
  seqLength: Number,
  meta: {}
});

/**
 * Set the directory path for the ORF from it's full path.
 * TODO: This could also be a virtual
 */
OrfSchema.pre('save', function(next) {
  this.dirname = path.dirname(this.path);
  next();
});

function getSeqFromAnalysis(schema, name, orf, seqs, cb){
  schema.findById(orf.analysis[name], function(err, obj){
    if(obj){
      seqs.push(obj.sequence);
    }else{
      orf.analysis[name] = null;
    }
    cb(null, seqs);
  })
}

/**
 * Populate ORF sequence(s) from analyses
 * TODO: We should probably prevent analyses from having varying sequences for
 * TODO: the same ORF.
 */
OrfSchema.pre('save', function(next) {
  var ORF = this;

  asy.waterfall([
    function(callback) {
      var seqs = [];
      getSeqFromAnalysis(Disopred, 'disopred', ORF, seqs, callback);
    },
    function(seqs, callback) {
      getSeqFromAnalysis(Tmhmm, 'tmhmm', ORF, seqs, callback);
    },
    function(seqs, callback) {
      getSeqFromAnalysis(Itasser, 'itasser', ORF, seqs, callback);
    }
  ], function (err, result) {
    //Eliminiate doubles
    var un = _.uniq(result);
    ORF.sequence = un;
    //If sequences mismatch, set length to 0
    if(un.length > 1){
      ORF.seqLength = 0;
    //If sequence match set length
    }else if(un.length === 1){
      ORF.seqLength = un[0].length
    }
    next();
  });
});

/**
 * Set the directory path for the Dataset from it's full path.
 * TODO: This could also be a virtual
 */
DatasetSchema.pre('save', function(next) {
  this.dirname = path.dirname(this.path);
  next();
});

var Dataset = mongoose.model('Dataset', DatasetSchema);
var Project = mongoose.model('Project', ProjectSchema);
var Orf = mongoose.model('Orf', OrfSchema);


var gridfileSchema = new mongoose.Schema({},{ strict: false });
var gridchunkSchema = new mongoose.Schema({},{ strict: false });

var Gridfile = mongoose.model("Gridfile", gridfileSchema, "fs.files" );
var Gridchunk = mongoose.model("Gridchunk", gridchunkSchema, "fs.chunks" );

export default {
  Project: Project,
  Dataset: Dataset,
  Orf: Orf,
  Gridfile: Gridfile,
  Gridchunk: Gridchunk
}
