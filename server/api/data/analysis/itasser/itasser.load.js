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

import Models from './../../files/models/models.model';

/**
 * Produces a function that gets list of all available experimental models
 * for the ORF.
 * @param {String} p Path in which to look for model files.
 * @return {Object} The function.
 */
function listModelFiles(p){
  return function (cb){
    glob("model*.@(pdb|PDB)", {cwd: p}, function (err, files) {
      if(err) {
        return cb(err, null);
      }
      if(!files || files.length < 0){
        return cb('No files available...', null);
      }
      files = files.map(function(str){
        return {
          name: str,
          shortName: str.split('.')[0],
          path: path.join(p, str)
        }
      });
      cb(null, files);
    });
  }
}

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
                model.cscore = Number(colArray[1]);
                if(len === 4){
                  model.decoys = Number(colArray[2]);
                  model.density = Number(colArray[3]);
                }else if(len === 6){
                  model.tm = colArray[2];
                  model.rmsd = colArray[3];
                  model.decoys = Number(colArray[4]);
                  model.density = Number(colArray[5]);
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

/**
 * Produces a function that saves model files into database using GridFS.
 * @return {Object} The function.
 */
function createGridFiles(){
  return function(da, cb){
    var count = 0;
    var modelGridIds = [];

    da.forEach(function(file){

      var writestream = gfs.createWriteStream({filename: file.name, metadata: file});
      fs.createReadStream(file.path).pipe(writestream);

      writestream.on('close', function (gfsfile) {

          modelGridIds.push(gfsfile._id);
          count += 1;
          if (count === da.length){
            cb(null, modelGridIds);
          }
      });
    })
  }
}

/**
 * Loads model files into GridFS and returns IDs.
 * @param {String}
 * @param {String}
 * @return {List}
 */
function loadModels (subPath, cscorePath){
  return function (data, callback){

    asy.waterfall([

      listModelFiles(subPath),
      readCscoreFiles(cscorePath),
      createGridFiles()

    ], function (err, result) {

      if(result && !err){
        data.data.other.models = result;
        callback(null, data);
      }else{
        data.data.other.models = [];
        callback(null, data);
      }
    });
  }
}

export function load(orfpath, callback){

  var subPath = path.join(orfpath, 'itasser');

  var ssFilePath = path.join(subPath, 'seq.ss');
  var alignFilePath = path.join(subPath, 'coverage');
  var cscorePath = path.join(subPath, 'cscore');

  asy.waterfall([
    //**************************************************************************
    // Read secondary sequence file
    function(callback) {

      var rl = lineReader(ssFilePath);

      var lines = [];
      var data = {};
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
        data.data = {};

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
      //TODO: on error...
    },

    //**************************************************************************
    // Read alignement file
    function(data, callback) {
      var rl = lineReader(alignFilePath);

      var lines = [];
      var pos = 0;
      var method;
      data.data.other = {};
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
    loadModels(subPath, cscorePath)

  ], function (err, result) {
    if(result && ! err){

      result.metadata = {};
      result.path = subPath;
      callback(result)
    }else{
      console.log(err)
      callback(null);
    }

  });

}
