'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

import Bio from './../../bio.model';
import Analysis from './../../analysis.model'

var TopconsSchema = new mongoose.Schema({
  data: {
    sequential: [
      {
        deltaG: Number,
        topRel: Number,
        zCord: Number,
        predictions: {
          scampiSeq: String,
          scampiMsa: String,
          prodiv: String,
          pro: String,
          octopus: String,
          topcons: String
        }
      }
    ],
    other: {
      methods: [String]
    }
  }
});
/**
TopconsSchema.pre('save', function(next) {
  console.log(this)

  next();
});
**/
var Topcons = Analysis.discriminator('Topcons', TopconsSchema);

export default Topcons
