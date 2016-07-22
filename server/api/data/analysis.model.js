'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
import Bio from './bio.model';

var AnalysisSchema = new mongoose.Schema({
  data: {
    sequential: [
      {
        position: Number,
        amino: Bio.Amino
      }
    ],
    other: {}
  },
  metadata: {},
  sequence: String,
  path: { type: String, unique: true},
  stats: {}
});

var Analysis = mongoose.model('Analysis', AnalysisSchema);

export default Analysis;
