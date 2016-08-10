'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var extend = require('mongoose-schema-extend');
import Bio from './../../bio.model';
import Analysis from './../analysis.model'

var DisopredSchema = new mongoose.Schema({
  data: {
    sequential: [
      {
        binding: Number,
        disorder: Number
      }
    ],
    discrete: {
      sequenceLength: Number,
      percentAboveThreshold: Number,
    }
  }
});

DisopredSchema.pre('save', function(next) {
  this.data.discrete.percentAboveThreshold = calculateAboveThreshold(this);
  //Calculate sequence length
  this.data.discrete.sequenceLength = this.sequence.length;

  next();
});

function calculateAboveThreshold (obj){
  var total = 0;
  obj.data.sequential.forEach(function(d){
    if(d.disorder > 0.5) total += 1;
  })
  return total*100.0/obj.data.sequential.length;
}


var Disopred = Analysis.discriminator('Disopred', DisopredSchema);

export default Disopred
