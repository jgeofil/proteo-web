/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/data              ->  index
 */

'use strict';

import _ from 'lodash';

var fs = require('fs');
var path = require("path");

//TODO: Modifier pour process.env.DATAPATH
var dataPath = path.join(__dirname, '/../../../data/');

function getSubDirs(dir, cb) {
  fs.readdir(dir, function(err, files) {
    var dirs = [];
    var filePath;
    var checkDirectory = function (i,l){
      return function(err, stat) {
        if(stat.isDirectory()) {
            dirs.push(files[i]);
        }
        if(i + 1 === l) { // last record
          cb(dirs,err);
        }
      };
    };

    for(var i=0, l=files.length; i<l; i++) {
      if(files[i][0] !== '.') { // ignore hidden
        filePath = path.join(dir,files[i]);
        fs.stat(filePath, checkDirectory(i, l));
      }
    }
  });
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function responseWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

// Gets a list of available data sets
export function index(req, res) {
  getSubDirs(dataPath, function(dirs, err){
    console.log(dirs)
    if(err){
      res.status(500).send(err);
    }else{
      res.status(200).json(dirs);
    }
  });
}

// Gets a single Data from the DB
export function show(req, res) {
  responseWithResult(res);
}
