'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

import Bio from './../../bio.model';
import Analysis from './../../analysis.model'

var ItasserSchema = new mongoose.Schema({
  data: {
    sequential: [
      {
        beta: Number,
        coil: Number,
        helix: Number,
        symbol: String
      }
    ],
    other: {
      alignments: [
        {
          //pdbid: String,
          //rank: Number,
          //zz0: Number,
          //method: String,
          //coverage: [String]
        }
      ],
      models: [
        {
          //cscore: Number,
          //decoys: Number,
          //dentisty: Number,
          //name: String,
          //rmsd: String,
          //tm: String
        }
      ]
    }
  }
});

ItasserSchema.pre('save', function(next) {


  next();
});

var Itasser = Analysis.discriminator('Itasser', ItasserSchema);

export default Itasser
