'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var User = require('./../user/user.model');

var GroupSchema = new mongoose.Schema({
  name: String,
  active: Boolean,
  permissions: [String],
  users: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

export default mongoose.model('Group', GroupSchema);
