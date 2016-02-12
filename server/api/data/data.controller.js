'use strict';

import _ from 'lodash';

var util = require('./util');

var fs = require('fs');
var path = require('path');
var readMultipleFiles = require('read-multiple-files');
var asy = require('async');

//TODO: Modifier pour process.env.DATAPATH
var dataPath = path.join(__dirname, '/../../data/');

var dataCache = [];
var orfCache = {};

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}

var dirs = getDirectories(dataPath);
dirs.forEach(function(dir){
  var subs = getDirectories(path.join(dataPath, dir))
  var metaLoc = path.join(dataPath, dir, 'meta.json');
  try{
    var file = JSON.parse(fs.readFileSync(metaLoc));
    file.name = dir;
    file.quantity = subs.length;
    dataCache.push(file)
  }catch(er){
    console.log(er)
  }

  var orfs = [];
  subs.forEach(function(sub){
    try{
      var metaLoc = path.join(dataPath, dir, sub ,'meta.json');
      var file = JSON.parse(fs.readFileSync(metaLoc));
      file.name = sub;
      orfs.push(file)
    }catch(er){
      console.log(er)
    }
  })
  orfCache[dir] = orfs;
});

// Gets a list of available data sets
export function index(req, res) {
  res.status(200).json(dataCache);
}

// Gets a list of available data sets
export function orfs(req, res) {
  res.status(200).json(orfCache[req.params.dataId]);
}
