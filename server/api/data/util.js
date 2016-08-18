'use strict';

var fs = require('fs');
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

export function getDirectories(srcpath) {
  try{
    return fs.readdirSync(srcpath).filter(function(file) {
      return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
  }catch(er){
    console.log("Error getting directories: " + er)
    return [];
  }
}














//a
