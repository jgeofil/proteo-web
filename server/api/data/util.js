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

export function isAuthorizedOnGroup(req, res, next) {
  Group.find({users: mongoose.Types.ObjectId(req.user._id)}, function(err,groups){
    //TODO: error
    var permissions = [];
    groups.forEach(function(d){
      permissions = permissions.concat(d.permissions);
    })

    if(permissions.indexOf(req.params.projectId) === -1){
      res.status(403).end();
    }else{
      next();
    }

  });
}

function readMetaDataAsync(path, callback){
  fs.readFile(path, function(err, data){
  if (err) console.log("Error loading metaData file: " + err);
  try{
    var file = JSON.parse(fs.readFileSync(path));
    file.dateCreated = new Date(file.dateCreated);
    file.dateModified = new Date(file.dateModified);
    callback(file);
  }catch(er){
    console.log("Error reading metaData file: " + er)

    callback({});
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
    console.log("Error reading metaData file: " + er)
  }
  return file;
}

export function fetchMetadataAsync(analysis) {

  return function(req, res, next){
    var metaPath = path.join(DATA_PATH, req.params.projectId, req.params.dataId, req.params.orfId, analysis,'meta.json');

    readMetaDataAsync(metaPath, function(meta){
      req.params.metadata = meta;
      next();
    })
  }

}
















//a
