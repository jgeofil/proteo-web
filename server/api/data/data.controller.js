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

import Disopred from './analysis/disopred/disopred.model';
var disoLoad = require('./analysis/disopred/disopred.load')

import Tmhmm from './analysis/tmhmm/tmhmm.model';
var tmhmmLoad = require('./analysis/tmhmm/tmhmm.load')


// Location of data folder
var DATA_PATH = config.data;

function getDirectories(srcpath) {
  try{
    return fs.readdirSync(srcpath).filter(function(file) {
      return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
  }catch(er){
    console.log("Error getting directories: " + er)
    return [];
  }
}

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
        loadAnalyses(orfSaved);
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
        Disopred.find({}).removeAsync().then(function(){
          Tmhmm.find({}).removeAsync().then(function(){
            readProjects();
          })
        })
      })
    })
  })
}

updateData();

function getAnalyses (path) {
  var analyses = {};
  var dirs = getDirectories(path);
  dirs.forEach(function(dir){
    analyses[dir] = true;
  })
  return analyses;
}

function loadAnalyses(orf){
  if (orf.analyses.hasOwnProperty("disopred")) {
    loadDisopred(orf);
    loadTmhmm(orf);
  }
}

/**
 * Loads a disopred analysis into an Orf using its path
 * @param {Object} orf The Orf
 * @return {null}
 */
function loadDisopred(orf){
  disoLoad.load(orf.path, function(result){
    if(result !== null){
      util.readMetaDataAsync(path.join(orf.path, 'disopred', 'meta.json'), function(meta){
        result.metadata = meta;
        Disopred.create(result, function(err, disoObj){
          if(err){
            console.log(err);
          }else {
            orf.analysis.disopred = disoObj._id;
            orf.save();
          }
        })
      })
    }
  })
}

/**
 * Loads a tmhmm analysis into an Orf using its path
 * @param {Object} orf The Orf
 * @return {null}
 */
function loadTmhmm(orf){
  tmhmmLoad.load(orf.path, function(result){
    if(result !== null){
      util.readMetaDataAsync(path.join(orf.path, 'tmhmm','meta.json'), function(meta){
        result.metadata = meta;
        Tmhmm.create(result, function(err, tmhObj){
          if(err){
            console.log(err);
          }else {
            orf.analysis.tmhmm = tmhObj._id;
            orf.save();
          }
        })
      })
    }
  })
}

// Gets a list of available
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
  var subPath = path.join(DATA_PATH, req.params.projectId, req.params.dataId);

  Data.Orf
    .find({dirname: subPath})
    .populate('analysis.disopred', 'stats sequence')
    .populate('analysis.tmhmm', 'stats sequence')
    .exec(function(err, orfs){
      if(!err){
        res.status(200).json(orfs);
      }else{
        res.status(500).send("Error reading ORFs.");
      }
    })
}

// Gets one ORF by name
export function oneOrf(req, res) {
  var subPath = path.join(DATA_PATH, req.params.projectId, req.params.dataId, req.params.orfId);

  Data.Orf
    .findOne({path: subPath})
    .populate('analysis.disopred', 'stats sequence')
    .populate('analysis.tmhmm', 'stats sequence')
    .exec(function(err, orf){
      if(!err && orf){
        res.status(200).json(orf);
      }else{
        res.status(500).send("Error reading ORFs.");
      }
    })
}


export function datasets(req, res) {
  var subPath = path.join(DATA_PATH, req.params.projectId);

  Data.Dataset.find({dirname: subPath}).populate('orfs').exec(function(err, datasets){
    if(!err){
      res.status(200).json(datasets);
    }else{
      res.status(500).send("Error reading datasets.");
    }
  })
}

export function update(req, res){
  updateData();
  console.log("DataUpdated as per request")
  res.status(200).send("Done.");
}
