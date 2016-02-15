'use strict';

import _ from 'lodash';
import config from '../../config/environment';

var fs = require('fs');
var path = require('path');
var chokidar = require('chokidar'); //To watch for data file changes

// Location of data folder
var dataPath = config.data;

// List of available data folders and their metadata
var dataCache = [];

// Dictionnary of available ORFs and their metadata for each data folder
var orfCache = {};

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}

// Limit updates to one per 5 seconds
var triggered = false;

function updateData(){
  dataCache = [];
  orfCache = {};

  var dirs = getDirectories(dataPath); //Get all available data folders

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

  triggered = false;
}

function triggerUpdate(){
  if(triggered === false){
    triggered = true;
    setTimeout(updateData, 5000);
  }
}

updateData();

// Watch data folder for changes
chokidar.watch(dataPath, {
  ignoreInitial: true,
  awaitWriteFinish: true,
  ignored: /[\/\\]\./
})
.on('all', (event, path) => {
  console.log(event, path);
  updateData();
});

// Gets a list of available data sets
export function index(req, res) {
  res.status(200).json(dataCache);
}

// Gets a list of available data sets
export function orfs(req, res) {
  res.status(200).json(orfCache[req.params.dataId]);
}
