'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var User = require('./../user/user.model');

var GroupSchema = new mongoose.Schema({
  name: { type: String, unique: true},
  active: { type: Boolean, default: true },
  permissions: { type: [String], default: [] },
  users: { type: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}], default: [] }
});

export default mongoose.model('Group', GroupSchema);
