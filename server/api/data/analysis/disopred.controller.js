'use strict';

import _ from 'lodash';
import config from '../../../config/environment';

//var util = require('./util');
var path = require('path');
var fs = require('fs');
var fasta = require('bionode-fasta');
var lineReader = require('linebyline');
var asy = require('async');

// Location of data folder
var dataPath = config.data;


// Get JSON formatted DISOPRED3 output
export function disopred3(req, res){
  console.log("hererer")

  var subPath = path.join(dataPath, req.params.dataId, req.params.orfId, 'disopred3');
  console.log(subPath)

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

    var formatted = [];
    if(result && ! err){
      var seqList = result.seq.split('');

      result.diso.values.forEach(function(d,i){
        formatted.push({
          pos: i+1,
          amino: seqList[i],
          bind:{
            value: result.bind.values[i],
            symbol: result.bind.symbol[i]
          },
          diso:{
            value: result.diso.values[i],
            symbol: result.diso.symbol[i]
          }
        })
      });

      res.status(200).json({seq: result.seq, data: formatted});
    }else{
      res.status(404).send("Not found");
    }

  });

}

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
      return Number(line[3]);
    });
    data.symbol = lines.map(function(line){
      return line[2];
    });
    callback(null, data);
  });
};
