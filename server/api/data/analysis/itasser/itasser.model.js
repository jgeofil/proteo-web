'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

import Bio from './../../bio.model';
import Analysis from './../analysis.model'

var ItasserSchema = new mongoose.Schema({
  data: {
    sequential: [
      {
        beta: {type: Number, required: true, min: 0, max:1},
        coil: {type: Number, required: true, min: 0, max:1},
        helix: {type: Number, required: true, min: 0, max:1},
        symbol: {type: String, required: true, enum: ['C', 'H', 'E']}
      }
    ],
    other: {
      alignments: {type: [
        {type: {
          pdbid: {type: String, required: true},
          rank: {type: Number, required: true, min: 1},
          zz0: {type: Number, required: true},
          method: {type: String, required: true},
          coverage: {type: [String], required: true}
        }}
      ]},
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
