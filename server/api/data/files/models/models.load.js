'use strict';

//var util = require('./util');
var path = require('path');
var asy = require('async');
var glob = require("glob");
var util = require('./../../util');
var fs = require('fs');
var Grid = require('gridfs-stream');
var mongoose = require('bluebird').promisifyAll(require('mongoose'));
import Models from './models.model';
var conn = mongoose.connection;
Grid.mongo = mongoose.mongo;
var gfs = new Grid(conn.db);

/**
 * Produces a function that gets list of all available experimental models
 * for the ORF.
 * @param {String} p Path in which to look for model files.
 * @return {Object} The function.
 */
function listModelFiles(p, prefix){
  prefix = prefix || '*'
  return function (cb){
    glob(prefix+".@(pdb|PDB)", {cwd: p}, function (err, files) {
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
 * Produces a function that reads metadata files for each model.
 * @param {String} p Path in which to look for model files.
 * @return {Object} The function.
 */
function readCaptionFiles(p, func){
  return func || function(da, cb){
    var count = 0;

    da.forEach(function(file){
      var metaPath = path.join(p, file.shortName+'.json');
      util.readMetaDataAsync(metaPath, function(meta){
        file.metadata = meta;
        count += 1;
        if (count === da.length){
          cb(null, da);
        }
      })
    })
  }
}

/**
 * Produces a function that saves model files into database using GridFS.
 * @return {Object} The function.
 */
function createGridFiles(){
  return function(da, cb){
    var count = 0;

    da.forEach(function(file){

      var writestream = gfs.createWriteStream({filename: file.name});
      fs.createReadStream(file.path).pipe(writestream);

      writestream.on('close', function (gfsfile) {

          file.gridFile = gfsfile._id;
          count += 1;
          if (count === da.length){
            cb(null, da);
          }
      });
    })
  }
}

function saveModels (project){
  return function(data, callback){
    var count = 0;
    var idList = [];
    data.forEach(function(f){
      f.project = project;
      Models.create(f, function(err, anaObj){
        if(err){
          console.log(err);
        }else {
          idList.push(anaObj._id)
          count += 1;
          if(count === data.length){
            callback(null, idList);
          }
        }

      })
    })
  }
}

/**
 * Loads experimental model files for an ORF.
 * @param {String} orfpath The path to the ORF.
 * @param {String} callback Callback for the data.
 * @return {null} Data is passed to callback.
 */
export function load(orfpath, callback){

  var subPath = path.join(orfpath, 'models');
  return new Promise(function(resolve, reject){
    asy.waterfall([

      listModelFiles(subPath),
      readCaptionFiles(subPath),
      createGridFiles()

    ], function (err, result) {

      if(err){
        return reject(err);
      }else{
        return resolve(result);
      }
    });
  });
}

/**
 * Loads experimental model files for an ORF.
 * @param {String} orfpath The path to the ORF.
 * @param {String} callback Callback for the data.
 * @return {null} Data is passed to callback.
 */
export function customLoad(subPath, prefix, metaFunc, project){
  return function (callback){
    asy.waterfall([
      listModelFiles(subPath, prefix),
      readCaptionFiles(subPath, metaFunc),
      createGridFiles(),
      saveModels(project)
    ], function (err, result) {
      if(result && !err){
        callback(null,result);
      }else{
        callback(err, null);
      }
    });
  }

}
