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
        membrane: {type: Number, required: true, min: 0, max:1}
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

TmhmmSchema.pre('save', function(next) {
  //Producde sequence string
  var s = this.data.sequential.map(function (a) {
    return a.amino;
  });
  this.sequence = s.join('');

  //Calculate sequence length
  this.data.discrete.sequenceLength = this.sequence.length;

  next();
});

var Tmhmm = Analysis.discriminator('Tmhmm', TmhmmSchema);

export default Tmhmm
