'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var DisopredSchema = new mongoose.Schema({
  data: [
    {
      amino: String,
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
    percentAboveThreshold: Number,
  },
  metadata: {},
  path: { type: String, unique: true}
});

DisopredSchema.pre('save', function(next) {

  this.stats.percentAboveThreshold = calculateAboveThreshold(this);
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
