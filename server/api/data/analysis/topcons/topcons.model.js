'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var TopconsSchema = new mongoose.Schema({
  deltaG: [
    {
      pos: Number,
      value: Number
    }
  ],
  topRel: [
    {
      pos: Number,
      value: Number
    }
  ],
  zCord: [
    {
      pos: Number,
      value: Number
    }
  ],
  predictions: [
    {
      method: String,
      values: [String]
    }
  ],
  stats: {},
  metadata: {},
  path: { type: String, unique: true}
});

var Topcons = mongoose.model('Topcons', TopconsSchema);

export default Topcons
