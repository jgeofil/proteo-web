'use strict';

import config from '../../config/environment';

var fs = require('fs');
var path = require('path');
var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var asy = require('async');

import Data from './data.model';
import Disopred from './analysis/disopred/disopred.model';
import Tmhmm from './analysis/tmhmm/tmhmm.model';
import Topcons from './analysis/topcons/topcons.model';
import Itasser from './analysis/itasser/itasser.model';
import Images from './files/images/images.model';
import Models from './files/models/models.model';
import User from './../user/user.model';
import Group from './../group/group.model';

var tmhmmLoad = require('./analysis/tmhmm/tmhmm.load');
var disoLoad = require('./analysis/disopred/disopred.load');
var topconsLoad = require('./analysis/topcons/topcons.load');
var itasserLoad = require('./analysis/itasser/itasser.load');
var modelsLoad = require('./files/models/models.load');
var imagesLoad = require('./files/images/images.load');

var util = require('./util');

// Location of data folder
var DATA_PATH = config.data;

/**
 * Loads all ORFs for a specified Dataset.
 * @param {Object} dataset The Dataset for wich to load ORFs.
 * @return {null} ORFs are loaded.
 */
function readOrfs(dataset){
  // Read directories
  var orfs = util.getDirectories(dataset.path)
  var count = 0;

  orfs.forEach(function(orf){
    // Create record in database for ORF
    Data.Orf.create({
      name: orf,
      meta: util.readMetaData(path.join(dataset.path, orf, 'meta.json')),
      path: path.join(dataset.path, orf),
      dataset: dataset._id,
      project: dataset.project,
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

/**
 * Loads all Datsets for a specified Project.
 * @param {Object} project The Project for wich to load Datasets.
 * @return {null} Projects are loaded.
 */
function readDatasets(project){
  // Read directories
  var datasets = util.getDirectories(project.path)
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

/**
 * Loads all projects from DATA_PATH folder into database.
 * @return {null} Data is loaded.
 */
function readProjects() {
  var projects = util.getDirectories(DATA_PATH); // Get all available project folders

  projects.forEach(function(proj){
    Data.Project.create({
      name: proj,
      meta: util.readMetaData(path.join(DATA_PATH, proj, 'meta.json')),
      path: path.join(DATA_PATH, proj)
    }, function (err, projSaved) {
      if (err) console.log("Error saving new project: " + err)
      else{
        //***********************************************************************
        // TESTING
        // TODO: GET RID OF THIS
        Group.findOne({name: 'admin'}).exec(function (err, doc) {
          if(doc){
            doc.permissions.push(projSaved._id);
            User.find({role: 'admin'}).exec(function(err, usr){
              if(usr){
                usr.forEach(function(u){
                  doc.users.push(u._id);
                })
                doc.save(function(){
                  readDatasets(projSaved);
                })
              }
            })
          }else{

            Group.create({
              name: 'admin',
              permissions: [projSaved._id],
              users: [],
              active: true
            },function(err, gr){
              User.find({role: 'admin'}).exec(function(err, usr){
                if(usr){
                  usr.forEach(function(u){
                    gr.users.push(u._id);
                  })
                  gr.save(function(){
                    readDatasets(projSaved);
                  })
                }
              })
            })

          }
        })
      }
    });
  });
}

/**
 * Remove all data in database and reload from data files.
 * @return {null} Data is refreshed from files.
 */
function updateData(){

  // Remove all existing entries and create new ones
  Data.Project.find({}).removeAsync().then(function(){
  Data.Dataset.find({}).removeAsync().then(function(){
  Data.Orf.find({}).removeAsync().then(function(){
  Data.Gridchunk.find({}).removeAsync().then(function(){
  Data.Gridfile.find({}).removeAsync().then(function(){
  Disopred.find({}).removeAsync().then(function(){
  Tmhmm.find({}).removeAsync().then(function(){
  Topcons.find({}).removeAsync().then(function(){
  Itasser.find({}).removeAsync().then(function(){
  Models.find({}).removeAsync().then(function(){
    Images.find({}).removeAsync().then(function(){
    readProjects();
  })})})})})})})})})})});
}

/**
 * Checks for presence of analysis folders in ORF folder.
 * @param {Object} orf The Orf
 * @return {Object} Object where each analysis folder found is a property set to true.
 */
function getAnalyses (path) {
  var analyses = {};
  var dirs = util.getDirectories(path);
  dirs.forEach(function(dir){
    analyses[dir] = true;
  })
  return analyses;
}

/**
 * Loads all analyses associated with an ORF.
 * @param {Object} orf The Orf
 * @return {null}
 */
function loadAnalyses(orf){

  asy.series([
    function(cb){
      loadAnalysis(orf, disoLoad.load, 'disopred', Disopred, cb);
    },
    function(cb){
      loadAnalysis(orf, tmhmmLoad.load, 'tmhmm', Tmhmm, cb);
    },
    function(cb){
      loadAnalysis(orf, topconsLoad.load, 'topcons', Topcons, cb);
    },
    function(cb){
      loadFiles(orf, modelsLoad.load, 'models', Models, cb);
    },
    function(cb){
      loadAnalysis(orf, itasserLoad.load, 'itasser', Itasser, cb);
    },
    function(cb){
      loadFiles(orf, imagesLoad.load, 'images', Images, cb);
    }
  ], function(){
    orf.save();
  });
}


 /**
  * Loads a file type into an Orf using its path.
  * @param {Object} orf The Orf
  * @param {Object} lf The loading function for the file type
  * @param {Object} name The name for the file type
  * @param {Object} ac The file class
  * @param {Object} cb Callback on completion
  * @return {null}
  */
function loadFiles(orf, lf, name, ac, cb){
  if(orf.analyses.hasOwnProperty(name)){
    lf(orf.path, function(result){
      if(result !== null){
        var count = 0;
        var idList = [];
        result.forEach(function(f){
          f.project = orf.project;
          ac.create(f, function(err, anaObj){
            if(err){
              console.log(err);
            }else {
              idList.push(anaObj._id)
              count += 1;
              if(count === result.length){
                orf.files[name] = idList;
                cb(null);
              }
            }

          })
        })
      }else{
        cb(null);
      }
    })
  }else{
    cb(null);
  }
}

/**
 * Loads an analysis into an Orf using its path.
 * @param {Object} orf The Orf
 * @param {Object} lf The loading function for the analysis
 * @param {Object} name The name for the analysis
 * @param {Object} ac The analysis class
 * @param {Object} cb Callback on completion
 * @return {null}
 */
function loadAnalysis(orf, lf, name, ac, cb){
  if(orf.analyses.hasOwnProperty(name)){
    lf(orf.path, function(result){
      if(result !== null){
        util.readMetaDataAsync(path.join(orf.path, name,'meta.json'), function(meta){
          result.metadata = meta;
          result.project = orf.project;
          ac.create(result, function(err, anaObj){
            if(err){
              console.log(err);
            }else {
              orf.analysis[name] = anaObj._id;
            }
            cb(null);
          })
        })
      }
    }, orf.project)
  }else{
    cb(null);
  }
}

/**
 * Loads data into database.
 * @return {null}
 */
export function load (){
  updateData();
}

/**
 * Reloads data into database.
 * @return {null}
 */
export function update (){
  updateData();
}
