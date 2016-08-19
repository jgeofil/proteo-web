'use strict';
var fs = require("bluebird").promisifyAll(require("fs")); //This is most convenient way if it works for you
var path = require("path");
var glob = require("glob");
var readMultipleFiles = require('read-multiple-files');
var asy = require('async');

// Read metadata file for Projects, Datasets, ORFs
export function readMetaData(path){
  var file = {};
  try{
    file = JSON.parse(fs.readFileSync(path));
    file.dateCreated =  new Date(file.dateCreated);
  }catch(er){
    //console.log("Error reading metaData file: " + er)
    file = {};
  }
  return file;
}

// Read metaData for analyses
export function readMetaDataAsync(path, callback){
  fs.readFile(path, function(err, data){
    //if (err) console.log("Error loading metaData file: " + err);
    try{
      var file = JSON.parse(fs.readFileSync(path));
      file.dateCreated = new Date(file.dateCreated);
      file.dateModified = new Date(file.dateModified);
      callback(file);
    }catch(er){
      //console.log("Error reading metaData file: " + er)
      callback({});
    }
  });
}

// Read metaData for analyses
export function readMeta(analysis){
  try{
    var file = JSON.parse(fs.readFileSync(path.join(analysis.path, 'meta.json')));
    file.dateCreated = new Date(file.dateCreated);
    file.dateModified = new Date(file.dateModified);
    analysis.metadata = file;
    return analysis;
  }catch(er){
    return analysis;
  }
}

export function getDirectories(srcpath) {
  return fs.readdirAsync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}

export function filePathExists(filePath,callback) {
    fs.stat(filePath, (err, stats) => {
      if (err && err.code === 'ENOENT') {
        callback(false, null);
      } else if (err) {
        callback(false, 'Error file access');
      }
      if (stats.isFile() || stats.isDirectory()) {
        callback(true, null);
      }
    });
}














//a
