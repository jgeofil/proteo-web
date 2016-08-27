'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var AnaUtil = require('./../analysis.util');

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

AnaUtil.addSequenceVirtualToSchema(TmhmmSchema);

var Tmhmm = Analysis.discriminator('Tmhmm', TmhmmSchema);

export default Tmhmm
