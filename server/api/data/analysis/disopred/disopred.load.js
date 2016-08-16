'use strict';

import _ from 'lodash';

//var util = require('./util');
var path = require('path');
var fs = require('fs');
var fasta = require('bionode-fasta');
var lineReader = require('linebyline');
var asy = require('async');
var Original = require('./../../files/originals/originals.load');

var readDisoFile = function(path, callback){
  var rl = lineReader(path);

  var lines = [];
  var data = {};

  rl
  .on('error', function (err) {
    return callback(err, data);
  })
  .on('line', function (line) {
    if(line[0]!== '#'){
      lines.push(line.split(' ').filter(function(el) {return el.length !== 0}));
    }
  })
  .on('close', function (){
    data.values = lines.map(function(line){
      var val = isNaN(Number(line[3])) ? 0 :  Number(line[3]);
      return val;
    });
    data.symbol = lines.map(function(line){
      return line[2];
    });
    callback(null, data);
  });
};

// Get JSON formatted DISOPRED3 output
export function load(orfpath, callback){

  var subPath = path.join(orfpath, 'disopred');

  var seqFilePath = path.join(subPath, 'disopred' + '.seq');
  var disoFilePath = path.join(subPath, 'disopred' + '.seq.diso');
  var bindFilePath = path.join(subPath, 'disopred' + '.seq.pbdat');

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
    },
    Original.loadToAnalysis([
      {name: 'disopred.seq', path: seqFilePath},
      {name: 'disopred.seq.diso', path: disoFilePath},
      {name: 'disopred.seq.pbdat', path: bindFilePath},
    ])
  ], function (err, result) {

    var formatted = [];
    if(result && ! err){
      var seqList = result.seq.split('');


      result.diso.values.forEach(function(d,i){
        formatted.push({
          position: i+1,
          amino: seqList[i],
          binding: result.bind.values[i],
          disorder: result.diso.values[i]

        })
      });

      callback({sequence: result.seq, data: {sequential: formatted}, metadata: {}, path: subPath, originals: result.originals});
    }else{
      callback(null);
    }

  });

}
