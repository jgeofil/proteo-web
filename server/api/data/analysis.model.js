'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var AnalysisSchema = new mongoose.Schema({

});

var Analysis = mongoose.model('Analysis', AnalysisSchema);

export default Analysis;
