'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

import Bio from './../../bio.model';
import Analysis from './../analysis.model'

var TmhmmSchema = new mongoose.Schema({
  data: {
    sequential: [
      {
        inside: Number,
        outside: Number,
        membrane: Number
      }
    ],
    discrete:{
      sequenceLength: Number,
      numberPredictedTMH: Number,
      expectedNumberAAInTMH: Number,
      expectedNumberAAFirst60: Number,
      totalProbNin: Number
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
