'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

import Bio from './../../bio.model';
import Analysis from './../../analysis.model'

var ItasserSchema = new mongoose.Schema({
  models: [
    {
      cscore: Number,
      decoys: Number,
      dentisty: Number,
      name: String,
      rmsd: String,
      tm: String
    }
  ],
  ss: [
    {
      amino: String,
      confidence: {
        beta: Number,
        coil: Number,
        helix: Number
      },
      pos: Number,
      symbol: String
    }
  ],
  align:{
    seq: String,
    ss: String,
    coverage: [
      {
        pdbid: String,
        rank: Number,
        zz0: Number,
        method: String,
        cov: String
      }
    ]
  }
});

ItasserSchema.pre('save', function(next) {

  this.sequence = this.align.seq;

  next();
});

var Itasser = Analysis.discriminator('Itasser', ItasserSchema);

export default Itasser
