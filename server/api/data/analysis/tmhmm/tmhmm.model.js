'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

import Bio from './../../bio.model';
import Analysis from './../analysis.model'

var TmhmmSchema = new mongoose.Schema({
  data: {
    sequential: [
      {
        inside: {type: Number, required: true, min: 0, max:1},
        outside: {type: Number, required: true, min: 0, max:1},
        membrane: {type: Number, required: true, min: 0, max:1},
        amino: {type: Bio.Amino, required: true}
      }
    ],
    discrete:{
      sequenceLength: Number,
      numberPredictedTMH: {type: Number, required: true, min: 0},
      expectedNumberAAInTMH: {type: Number, required: true, min: 0},
      expectedNumberAAFirst60: {type: Number, required: true, min: 0},
      totalProbNin: {type: Number, required: true, min: 0},
    }
  }
});


TmhmmSchema
.virtual('sequence')
.get(function () {
  if(Array.isArray(this.data.sequential)){
    var se = '';
    this.data.sequential.forEach(function(a){
      se = se + a.amino;
    })
    return se;
  }
  return null;
});


var Tmhmm = Analysis.discriminator('Tmhmm', TmhmmSchema);

export default Tmhmm
