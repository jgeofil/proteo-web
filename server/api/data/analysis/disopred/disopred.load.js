'use strict';

var path = require('path');
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

function formatData(data){
  data.data.sequential = [];
  var seqList = data.sequence.split('');
  data.temp.diso.values.forEach(function(d,i){
    data.data.sequential.push({
      position: i+1,
      amino: seqList[i],
      binding: data.temp.bind.values[i],
      disorder: data.temp.diso.values[i]
    })
  });
  return data;
}

// Get JSON formatted DISOPRED3 output
export function load(orfpath){

  var subPath = path.join(orfpath, 'disopred');
  var seqFilePath = path.join(subPath, 'disopred' + '.seq');
  var disoFilePath = path.join(subPath, 'disopred' + '.seq.diso');
  var bindFilePath = path.join(subPath, 'disopred' + '.seq.pbdat');

  return new Promise(function(resolve, reject){

    asy.waterfall([
      function(callback){
        return callback(null, {
          data: {},
          metadata: {},
          temp: {},
          path: subPath
        });
      },
      // Read fasta file
      function(data, callback) {
        fasta.obj(seqFilePath)
        .on('data', function(f){
          data.sequence = f.seq;
          callback(null, data);
        })
        .on('error', function(err) {
          return callback(err);
        });
      },
      // Read Disopred file
      function(data, callback) {
        readDisoFile(disoFilePath, function(err, retdata){
          data.temp.diso = retdata;
          callback(err, data);
        });
      },
      // Read Binding file
      function(data, callback) {
        readDisoFile(bindFilePath, function(err, retdata){
          data.temp.bind = retdata;
          callback(err, data);
        });
      },
      // Save Orginal files
      Original.loadToAnalysis([
        {name: 'disopred.seq', path: seqFilePath},
        {name: 'disopred.seq.diso', path: disoFilePath},
        {name: 'disopred.seq.pbdat', path: bindFilePath},
      ])
    ], function (err, result) {
      if(err){
        console.log(err)
        return reject(err);
      }else{
        result = formatData(result);
        return resolve(result);
      }
    });
  });
}
