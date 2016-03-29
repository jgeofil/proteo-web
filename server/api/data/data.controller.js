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
var util = require('./util');

// Location of data folder
var DATA_PATH = config.data;

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}

// Limit updates to one per 5 seconds
var triggered = false;

function readDatasets(project){
  // Read directories
  var datasets = getDirectories(project.path)
  var count = 0;

  datasets.forEach(function(set){
    // Create record in database for dataset
    Data.Dataset.create({
      name: set,
      meta: util.readMetaData(path.join(project.path, set , 'meta.json')),
      path: path.join(project.path, set),
      project: project._id // Reference to parent Project
    }, function(err, dataSaved){
      count +=1;
      if (err) console.log("Error saving new dataset: " + err)
      else{
        project.datasets.push(dataSaved._id); // Reference in parent Project
        // When all datasets records a associated with project, save project
        if(count >= datasets.length) {
          project.save(function(err){
            if(err) console.log("Error saving datasets to project: " + err)
          });
        }
        readOrfs(dataSaved);
      }
    })
  })
}

function readOrfs(dataset){
  // Read directories
  var orfs = getDirectories(dataset.path)
  var count = 0;

  orfs.forEach(function(orf){
    // Create record in database for ORF
    Data.Orf.create({
      name: orf,
      meta: util.readMetaData(path.join(dataset.path, orf, 'meta.json')),
      path: path.join(dataset.path, orf),
      dataset: dataset._id,
      analyses: getAnalyses(path.join(dataset.path, orf))
    }, function(err, orfSaved){
      count +=1
      if (err) console.log("Error saving new ORF: " + err)
      else{
        dataset.orfs.push(orfSaved._id);
        if(count >= orfs.length){
          dataset.save(function(err){
            if(err) console.log("Error saving ORFs to dataset: " + err)
          })
        }
      }
    })
  })
}

function readProjects() {
  var projects = getDirectories(DATA_PATH); // Get all available project folders

  projects.forEach(function(proj){
    Data.Project.create({
      name: proj,
      meta: util.readMetaData(path.join(DATA_PATH, proj, 'meta.json')),
      path: path.join(DATA_PATH, proj)
    }, function (err, projSaved) {
      if (err) console.log("Error saving new project: " + err)
      else{
        readDatasets(projSaved);
      }
    });
  });
}

function updateData(){

  // Remove all existing entries and create new ones
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


function getAnalyses (path) {
  var analyses = {};
  var dirs = getDirectories(path);
  dirs.forEach(function(dir){
    analyses[dir] = true;
  })
  return analyses;
}

// Gets a list of available data sets
export function index(req, res) {
  Group.find({users: mongoose.Types.ObjectId(req.user._id)}, function(err,groups){
    if(err){
      res.status(500).send("Error reading groups..")
    }else{
      var permissions = [];
      groups.forEach(function(d){
        permissions = permissions.concat(d.permissions);
      })

      Data.Project.find({}, function(err, projects){
        if(err){
          res.status(500).send("Error reading datasets..")
        }else{
          projects.forEach(function(d){
            if(permissions.indexOf(d.name) !== -1){
              d.authorized = true;
            }
          })
          res.status(200).json(projects);
        }
      })
    }
  });
}

// Gets a list of available orfs
export function orfs(req, res) {
  Data.Project.findOne({name: req.params.projectId}, function(err, project){
    if(project && !err){
      Data.Dataset.findOne({project: project._id, name: req.params.dataId}, function(err, dataset){
        if(dataset && !err){
          Data.Orf.find({dataset: dataset._id}, function(err, orfs){
            if(!err){
              res.status(200).json(orfs);
            }else{
              res.status(500).send("Error reading ORFs.");
            }
          })
        }else{
          res.status(403).send("Dataset not found.");
        }
      })
    }else{
      res.status(403).send("Project not found.");
    }
  })
}


export function datasets(req, res) {
  Data.Project.findOne({name: req.params.projectId}, function(err, project){
    if(project && !err){
      Data.Dataset.find({project: project._id}).populate('orfs').exec(function(err, datasets){
        if(!err){
          res.status(200).json(datasets);
        }else{
          res.status(500).send("Error reading datasets.");
        }
      })
    }else{
      res.status(403).send("Project not found.");
    }
  });
}
