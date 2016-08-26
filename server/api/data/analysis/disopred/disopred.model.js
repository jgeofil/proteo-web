'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var extend = require('mongoose-schema-extend');
import Bio from './../../bio.model';
import Analysis from './../analysis.model'

var DisopredSchema = new mongoose.Schema({
  data: {
    sequential: [
      {
        binding: {type: Number, required: true, min: 0, max: 1},
        disorder: {type: Number, required: true, min: 0, max: 1},
        amino: {type: Bio.Amino, required: true}
      }
    ],
    discrete: {
      sequenceLength: Number,
      percentAboveThreshold: Number,
    }
  }
});

DisopredSchema
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


DisopredSchema.pre('save', function(next) {
  this.data.discrete.percentAboveThreshold = calculateAboveThreshold(this);
  this.data.discrete.sequenceLength = this.data.sequential.length;
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
