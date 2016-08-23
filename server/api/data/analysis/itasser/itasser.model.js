'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

import Bio from './../../bio.model';
import Analysis from './../analysis.model'

var ItasserSchema = new mongoose.Schema({
  data: {
    sequential: [
      {
        beta: Number,
        coil: Number,
        helix: Number,
        symbol: String
      }
    ],
    other: {
      alignments: [
        {
          //pdbid: String,
          //rank: Number,
          //zz0: Number,
          //method: String,
          //coverage: [String]
        }
      ],
      models: [{type: mongoose.Schema.Types.ObjectId, ref: 'Model', default: []}]
    }
  }
});

ItasserSchema.pre('save', function(next) {
  var se = '';
  this.data.sequential.forEach(function(a){
    se += a.amino;
  })
  this.sequence = se;
  next();
});

var Itasser = Analysis.discriminator('Itasser', ItasserSchema);

export default Itasser
