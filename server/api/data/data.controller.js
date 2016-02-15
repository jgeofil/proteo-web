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

    var file = {};
    try{
      file = JSON.parse(fs.readFileSync(metaLoc));
    }catch(er){
      console.log(er)
    }
    file.name = dir;
    file.quantity = subs.length;
    dataCache.push(file)

    var orfs = [];
    subs.forEach(function(sub){
      var subPath = path.join(dataPath, dir, sub);
      var metaLoc = path.join(subPath,'meta.json');
      var file = {};
      try{
        file = JSON.parse(fs.readFileSync(metaLoc));
      }catch(er){
        console.log(er)
      }


      //TODO: read all dirs at once
      try {
        fs.accessSync(path.join(subPath,'disopred3'), fs.F_OK);
        file.disopred = true;
      } catch (e) {
          // It isn't accessible
      }

      try {
        fs.accessSync(path.join(subPath,'i-tasser'), fs.F_OK);
        file.itasser = true;
      } catch (e) {
          // It isn't accessible
      }

      try {
        fs.accessSync(path.join(subPath,'tmhmm'), fs.F_OK);
        file.tmhmm = true;
      } catch (e) {
          // It isn't accessible
      }


      file.name = sub;
      orfs.push(file)

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
