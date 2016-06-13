'use strict';

var fs = require('fs');
var path = require("path");
var glob = require("glob");
var readMultipleFiles = require('read-multiple-files');
var asy = require('async');
import Group from './../group/group.model';
import config from '../../config/environment';
var mongoose = require('bluebird').promisifyAll(require('mongoose'));

// Location of data folder
var DATA_PATH = config.data;

// Middleware - check if user is authorized on group
export function isAuthorizedOnGroup(req, res, next) {
  Group.find({users: mongoose.Types.ObjectId(req.user._id)}, function(err,groups){
    var permissions = [];
    groups.forEach(function(d){
      permissions = permissions.concat(d.permissions);
    })
    if(err){ // User is in no groups
      res.status(403).send("User is in no groups.");
    }
    else if(permissions.indexOf(req.params.projectId) === -1){ //User is not authorized on group
      res.status(403).send("User not authorized.");
    }else{
      next();
    }
  });
}

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
export function fetchMetadataAsync(analysis) {
  return function(req, res, next){
    var metaPath = path.join(DATA_PATH, req.params.projectId,
      req.params.dataId, req.params.orfId, analysis,'meta.json');

    readMetaDataAsync(metaPath, function(meta){
      req.params.metadata = meta;
      next();
    })
  }
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
