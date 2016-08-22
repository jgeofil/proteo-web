'use strict';

var fs = require('fs');
var Grid = require('gridfs-stream');
var asy = require('async');
var mongoose = require('bluebird').promisifyAll(require('mongoose'));
import Original from './originals.model';

var conn = mongoose.connection;
Grid.mongo = mongoose.mongo;
var gfs = new Grid(conn.db);


function readFiles (pathList){
  return function (callback){
    var count = 0;
    var ids = [];


    pathList.forEach(function(file){

      var writestream = gfs.createWriteStream({filename: file.name});
      fs.createReadStream(file.path).pipe(writestream);

      writestream.on('close', function (gfsfile) {

        file.gridFile = gfsfile._id;
        count += 1;
        if (count === pathList.length){
          callback(null, pathList);
        }

      });
    })
  }
}

function addIdsToAnalysis (analysis){
  return function (ids, callback){
    analysis.originals = ids;

    callback(null, analysis);
  }
}

function saveToOriginalModel (files, callback){

  var count = 0;
  var idList = [];
  files.forEach(function (file){
    Original.create(file, function(err, saved){
      if(err){
        console.log(err);
      }else {
        idList.push(saved._id)
        count += 1;
        if(count === files.length){

          callback(null, idList);
        }
      }
    })
  })
}

/**
 * Loads experimental model files for an ORF.
 * @param {String} orfpath The path to the ORF.
 * @param {String} callback Callback for the data.
 * @return {null} Data is passed to callback.
 */
export function loadToAnalysis(pathList){
  return function (data, callback){
    asy.waterfall([
      readFiles(pathList),
      saveToOriginalModel,
      addIdsToAnalysis(data)
    ], function (err, result) {
      if(result && !err){
        callback(null,result);
      }else{
        callback(null);
      }
    });
  }
}
