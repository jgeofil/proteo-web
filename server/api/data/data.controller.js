'use strict';

import _ from 'lodash';
import config from '../../config/environment';
import Group from './../group/group.model';
import User from './../user/user.model';
import Data from './data.model';
var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var fs = require('fs');
var path = require('path');
var chokidar = require('chokidar'); //To watch for data file changes

// Location of data folder
var DATA_PATH = config.data;

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}

// Limit updates to one per 5 seconds
var triggered = false;

// Read metadata file
function readMetaData(path){
  var file = {};
  try{
    file = JSON.parse(fs.readFileSync(path));
  }catch(er){
    console.log(er)
  }
  return file;
}

function readDatasets(project){
  var datasets = getDirectories(project.path)

  datasets.forEach(function(set){
    Data.Dataset.create({
      name: set,
      meta: readMetaData(path.join(project.path, set , 'meta.json')),
      path: path.join(project.path, set),
      project: project._id
    }, function(err, dataSaved){
      if (err) console.log(err)
      else{
        project.datasets.push(dataSaved._id);
        project.save(function(err){console.log(err)});
        readOrfs(dataSaved);
      }
    })
  })
}

function readOrfs(dataset){

  var orfs = getDirectories(dataset.path)

  orfs.forEach(function(orf){
    Data.Orf.create({
      name: orf,
      meta: readMetaData(path.join(dataset.path, orf, 'meta.json')),
      path: path.join(dataset.path, orf),
      dataset: dataset._id
    }, function(err, orfSaved){
      if (err) console.log(err)
      else{
        dataset.orfs.push(orfSaved._id);
        dataset.save(function(err){console.log(err)});
      }
    })
  })

}

function readProjects() {
  var projects = getDirectories(DATA_PATH); // Get all available project folders

  projects.forEach(function(proj){
    Data.Project.create({
      name: proj,
      meta: readMetaData(path.join(DATA_PATH, proj, 'meta.json')),
      path: path.join(DATA_PATH, proj)
    }, function (err, projSaved) {
      console.log("here")
      if (err) console.log(err)
      else{
        readDatasets(projSaved);
      }
    });
  });
}

function updateData(){

  // Remove all existing entries
  Data.Project.find({}).removeAsync().then(function(){
    Data.Dataset.find({}).removeAsync().then(function(){
      Data.Orf.find({}).removeAsync().then(function(){
        readProjects();
      })
    })
  })

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
chokidar.watch(DATA_PATH, {
  ignoreInitial: true,
  awaitWriteFinish: true,
  ignored: /[\/\\]\./
})
.on('all', (event, path) => {
  console.log(event, path);
  triggerUpdate();
});

// Gets a list of available data sets
export function index(req, res) {
  Group.find({users: mongoose.Types.ObjectId(req.user._id)}, function(err,groups){
    //TODO: error
    var permissions = [];
    groups.forEach(function(d){
      permissions = permissions.concat(d.permissions);
    })

    Data.Project.find({}, function(err, projects){
      //TODO: error
      projects.forEach(function(d){
        if(permissions.indexOf(d.name) !== -1){
          d.authorized = true;
        }
      })
      console.log(projects)
      res.status(200).json(projects);
    })
  });
}

// Gets a list of available orfs
export function orfs(req, res) {
  Data.Project.findOne({name: req.params.projectId}, function(err, project){
    if(project){
      Data.Dataset.findOne({project: project._id, name: req.params.dataId}, function(err, dataset){
        if(dataset){
          Data.Orf.find({dataset: dataset._id}, function(err, orfs){
            //TODO: error
            res.status(200).json(orfs);
          })
        }
      })
    }
    //TODO: error
  })
}


export function datasets(req, res) {
  Data.Project.findOne({name: req.params.projectId}, function(err, project){
    if(project){
      Data.Dataset.find({project: project._id}, function(err, datasets){
        //TODO: error
        console.log(datasets)
        res.status(200).json(datasets);
      })
    }
    //TODO: error
  })
}

/**

    var file = {};

    file.name = dir;
    file.quantity = subs.length;
    dataCache.push(file)

    var orfs = [];
    subs.forEach(function(sub){
      var subPath = path.join(DATA_PATH, dir, sub);
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

      try {
        fs.accessSync(path.join(subPath,'topcons'), fs.F_OK);
        file.topcons = true;
      } catch (e) {
          // It isn't accessible
      }


      file.name = sub;
      orfs.push(file)

    })

**/
