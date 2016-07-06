'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

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
  },
  sequence: String,
  stats: {},
  metadata: {},
  path: { type: String, unique: true}
});

ItasserSchema.pre('save', function(next) {

  this.sequence = this.align.seq;

  next();
});

var Itasser = mongoose.model('Itasser', ItasserSchema);

export default Itasser
