'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var AnaUtil = require('./../analysis.util')

import Bio from './../../bio.model';
import Analysis from './../analysis.model'

var TopconsSchema = new mongoose.Schema({
  data: {
    sequential: [
      {
        deltaG: {type: Number},
        topRel: {type: Number, min: 0, max: 1},
        zCord: {type: Number, required: true},
        predictions: {
          scampiSeq: String,
          scampiMsa: String,
          prodiv: String,
          pro: String,
          octopus: String,
          topcons: String
        },
        amino: {type: Bio.Amino, required: true}
      }
    ],
    other: {
      methods: {type: [String], required: true}
    }
  }
});

AnaUtil.addSequenceVirtualToSchema(TopconsSchema);

var Topcons = Analysis.discriminator('Topcons', TopconsSchema);

export default Topcons
