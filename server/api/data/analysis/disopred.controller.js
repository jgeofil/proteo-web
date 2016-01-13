'use strict';

import _ from 'lodash';

//var util = require('./util');
var path = require('path');
var fs = require('fs');
var fasta = require('bionode-fasta');
var lineReader = require('readline');
var asy = require('async');

//TODO: Modifier pour process.env.DATAPATH
var dataPath = path.join(__dirname, '/../../../../data/');


// Get JSON formatted DISOPRED3 output
export function disopred3(req, res){
  var subPath = path.join(dataPath, req.params.dataId, req.params.orfId, 'disopred3');

  var seqFilePath = path.join(subPath, req.params.orfId + '.seq');
  var disoFilePath = path.join(subPath, req.params.orfId + '.seq.diso');
  var bindFilePath = path.join(subPath, req.params.orfId + '.seq.pbdat');

  asy.waterfall([
    function(callback) {
      fasta.obj(seqFilePath)
      .on('data', function(data){
        callback(null, data);
      })
      .on('error', function(err) {
        return callback(err);
      });
    },
    function(data, callback) {
      readDisoFile(disoFilePath, function(err, retdata){
        data.diso = retdata;
        callback(err, data);
      });
    },
    function(data, callback) {
      readDisoFile(bindFilePath, function(err, retdata){
        data.bind = retdata;
        callback(err, data);
      });
    }
  ], function (err, result) {
    res.status(200).json(result);
  });

}

var readDisoFile = function(path, callback){
  var rl = lineReader.createInterface({
    input: fs.createReadStream(path)
  });

  var lines = [];
  var data = {};

  rl
  .on('line', function (line) {
    if(line[0]!== '#'){
      lines.push(line.split(' ').filter(function(el) {return el.length !== 0}));
    }
  })
  .on('close', function (){
    data.values = lines.map(function(line){
      return Number(line[3]);
    });
    data.symbol = lines.map(function(line){
      return line[2];
    });
    callback(null, data);
  });
};
