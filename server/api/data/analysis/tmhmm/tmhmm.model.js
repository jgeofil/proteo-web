'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var TmhmmSchema = new mongoose.Schema({
  data: [
    {
      amino: String,
      pos: Number,
      inside: Number,
      outside: Number,
      membrane: Number
    }
  ],
  sequence: String,
  domains: [
    {
      start: Number,
      end: Number,
      dom: String
    }
  ],
  stats: {
    sequenceLength: Number,
    numberPredictedTMH: Number,
    expectedNumberAAInTMH: Number,
    expectedNumberAAFirst60: Number,
    totalProbNin: Number
  },
  metadata: {},
  path: { type: String, unique: true}
});

TmhmmSchema.pre('save', function(next) {
  //Producde sequence string
  var s = this.data.map(function (a) {
    return a.amino;
  });
  this.sequence = s.join('');

  //Calculate sequence length
  this.stats.sequenceLength = this.sequence.length;

  next();
});

var Tmhmm = mongoose.model('Tmhmm', TmhmmSchema);

export default Tmhmm
