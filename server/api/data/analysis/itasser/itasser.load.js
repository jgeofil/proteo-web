'use strict';

//var util = require('./util');
var path = require('path');
var fs = require('fs');
var lineReader = require('linebyline');
var asy = require('async');
var glob = require("glob");
var Grid = require('gridfs-stream');
var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var conn = mongoose.connection;
Grid.mongo = mongoose.mongo;
var gfs = new Grid(conn.db);
var Original = require('./../../files/originals/originals.load');
var ModelsLoad = require('./../../files/models/models.load');
import Models from './../../files/models/models.model';

/**
 * Produces a function that reads cscore files for all models
 * @param {String} p Path in which to look for model files.
 * @return {Object} The function.
 */
function readCscoreFiles (p) {
  return function (data, callback) {
    var rl = lineReader(p);

    var lines = [];
    var pos = 0;

    rl
    .on('error', function (err) {
      return callback(err, data);
    })
    .on('line', function (line) {
      switch(pos){
        // Ignore header line
        case 0:
          if(line.substring(0,3) === '---'){ pos+=1; }
          break;
        default:
          var colArray = line.split(' ')
                          .filter(function(el) {return el.length !== 0});
          var len = colArray.length;
          if(len > 3){
            data.forEach(function(model){
              if(model.shortName === colArray[0]){
                model.metadata = {};
                model.metadata.cscore = Number(colArray[1]);
                if(len === 4){
                  model.metadata.decoys = Number(colArray[2]);
                  model.metadata.density = Number(colArray[3]);
                }else if(len === 6){
                  model.metadata.tm = colArray[2];
                  model.metadata.rmsd = colArray[3];
                  model.metadata.decoys = Number(colArray[4]);
                  model.metadata.density = Number(colArray[5]);
                }
              }
            })
          }
          break;
      }
    })
    .on('close', function (){
      callback(null, data);
    });
  }
}

export function load(orfpath, callback, projectId){

  var subPath = path.join(orfpath, 'itasser');

  var ssFilePath = path.join(subPath, 'seq.ss');
  var alignFilePath = path.join(subPath, 'coverage');
  var cscorePath = path.join(subPath, 'cscore');

  return new Promise(function(resolve, reject){

    asy.waterfall([
      ModelsLoad.customLoad(subPath, 'model*', readCscoreFiles(cscorePath), projectId),
      //**************************************************************************
      // Read secondary sequence file
      function(d, callback) {

        var rl = lineReader(ssFilePath);

        var lines = [];
        var data = {data: {other: {models: d}}};
        var first = true;

        rl
        .on('error', function (err) {
          return callback(err, data);
        })
        .on('line', function (line) {
          if(!first){ // ignore first line
            lines.push(line.split(' ').filter(function(el) {return el.length !== 0}));
          }else{
            first = false;
          }
        })
        .on('close', function (){

          data.data.sequential = lines.map(function(line){
            return {
              position: Number(line[0]),
              amino: line[1],
              symbol: line[2],
              coil: Number(line[3]),
              helix: Number(line[4]),
              beta: Number(line[5]),
            }
          });
          callback(null, data);
        });
      },

      //**************************************************************************
      // Read alignement file
      function(data, callback) {
        var rl = lineReader(alignFilePath);

        var lines = [];
        var pos = 0;
        var method;
        data.data.other.alignments = [];

        rl
        .on('error', function (err) {
          return callback(err, data);
        })
        .on('line', function (line) {
          switch(pos){
            // Ignore header line
            case 0:
              if(line.substring(0,2) === 'M:'){
                method = line.substring(3).split(', ')
                method = method.map(function(met){
                  return met.substring(2)
                });
              }
              if(line.substring(0,3) === 'Rnk'){ pos+=1; }
              break;
            // Retrieve secondary structure line
            case 1:
              //data.align.ss = line.split(' ')
              //                  .filter(function(el) {return el.length !== 0})[0]
              pos+=1;
              break;
            // Retrieve sequence line
            case 2:
              data.sequence = line.split(' ')
                                .filter(function(el) {return el.length !== 0})[0]
              pos+=1;
              break;
            // Retrieve all other alignement lines
            default:
              var colArray = line.split(' ')
                              .filter(function(el) {return el.length !== 0});
              if(colArray.length > 5){
                data.data.other.alignments.push({
                  rank: Number(colArray[0]),
                  pdbid: colArray[1],
                  zz0: Number(colArray[2]),
                  method: method[Number(colArray[3].replace(':', ''))-1],
                  coverage: colArray[4]
                });
              }
              break;
          }
        })
        .on('close', function (){
          callback(null, data);
        });
      },
      Original.loadToAnalysis([
        {name: 'seq.ss', path: ssFilePath},
        {name: 'coverage', path: alignFilePath},
        {name: 'cscore', path: cscorePath},
      ])

    ], function (err, result) {
      if(err){
        return reject(err);
      }else{
        result.metadata = {};
        result.path = subPath;
        return resolve(result);
      }
    });
  });

}
