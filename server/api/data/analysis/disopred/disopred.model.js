'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var extend = require('mongoose-schema-extend');
import Bio from './../../bio.model';
import Analysis from './../../analysis.model'


var DisopredSchema = Analysis.discriminator('Disopred', new mongoose.Schema({
  data: [
    {
      amino: Bio.Amino,
      pos: Number,
      bind: {
        symbol: String,
        value: Number
      },
      diso: {
        symbol: String,
        value: Number
      }
    }
  ],
  sequence: String,
  stats: {
    sequenceLength: Number,
    percentAboveThreshold: Number,
  },
  metadata: {},
  path: { type: String, unique: true}
}));

DisopredSchema.pre('save', function(next) {
  this.stats.percentAboveThreshold = calculateAboveThreshold(this);
  //Calculate sequence length
  this.stats.sequenceLength = this.sequence.length;

  next();
});

function calculateAboveThreshold (obj){
  var total = 0;
  obj.data.forEach(function(d){
    if(d.diso.value > 0.5) total += 1;
  })
  return total*100.0/obj.data.length;
}

var Disopred = mongoose.model('Disopred', DisopredSchema);

export default Disopred
