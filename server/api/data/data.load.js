'use strict';

import config from '../../config/environment';

var fs = require('fs');
var path = require('path');
var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var asy = require('async');
var BPromise = require("bluebird");
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
export function loadNewOrf(isRoot, orfs, dataset){
  if (typeof orfs === 'string' || orfs instanceof String){
    orfs = [orfs];
  }

  return BPromise.each(orfs, function(orf){
    return getAnalyses(path.join(isRoot?DATA_PATH:dataset.path, orf))
      .then(createOrf(orf, isRoot, dataset))
      .then(addOrfToDataset(dataset))
      .then(loadAnalyses)
  })
  .then(function(){
    return dataset.save()
      .then(function(dataset){
        console.log('Dataset: ' + dataset.name + ' updated with new ORFs')
        return dataset;
      });
  })
}

function createOrf(orf, isRoot, dataset){
  return function(analyses){
    return Data.Orf.create({
      name: orf,
      meta: util.readMetaData(path.join(isRoot?DATA_PATH:dataset.path, orf, 'meta.json')),
      path: path.join(isRoot?DATA_PATH:dataset.path, orf),
      dataset: dataset._id,
      project: dataset.project,
      analyses: analyses
    })
    .then(function(orfSaved){
      console.log('ORF: '+ orfSaved.name + ' created.')
      return orfSaved
    })
  }
}

function addOrfToDataset(dataset){
  return function(orfSaved){
    dataset.orfs.push(orfSaved._id);
    return orfSaved
  }
}

function addDatasetToProject(project){
  return function(datasetSaved){
    project.datasets.push(datasetSaved._id);
    return datasetSaved
  }
}


/**
 * Loads all Datsets for a specified Project.
 * @param {Object} project The Project for wich to load Datasets.
 * @return {null} Projects are loaded.
 */
function loadChildOrfs(dataset){
  return util.getDirectories(dataset.path)
    .then(function(orfs){
      return loadNewOrf(false, orfs, dataset);
    })
}

/**
 * Loads all Datsets for a specified Project.
 * @param {Object} project The Project for wich to load Datasets.
 * @return {null} Projects are loaded.
 */
function loadChildDatasets(project){
  return util.getDirectories(project.path)
    .then(function(datasets){
      return loadNewDataset(false, datasets, project);
    })
}

/**
 * Loads a project recursivly into the database.
 * @return {null} Data is loaded.
 */
export function loadNewProject (proj) {
  return Data.Project.create({
    name: proj,
    meta: util.readMetaData(path.join(DATA_PATH, proj, 'meta.json')),
    path: path.join(DATA_PATH, proj)
  })
  .then(function(projectSaved){
    console.log('Project: ' + projectSaved.name + ' created.');
    return projectSaved;
  })
  .then(loadChildDatasets);
}

function createDataset(isRoot, project){
  return function(set){
    return Data.Dataset.create({
      name: set,
      meta: util.readMetaData(path.join(isRoot?DATA_PATH:project.path, set , 'meta.json')),
      path: path.join(isRoot?DATA_PATH:project.path, set),
      project: project._id // Reference to parent Project
    })
    .then(function(datasetSaved){
      console.log('Dataset: ' + datasetSaved.name + ' created.')
      return datasetSaved;
    })
  }
}

/**
 * Loads a dataset recursivly into the database.
 * @return {null} Data is loaded.
 */
export function loadNewDataset (isRoot, setListOrName, project) {
  if (typeof setListOrName === 'string' || setListOrName instanceof String){
    setListOrName = [setListOrName];
  }

  return BPromise.each(setListOrName, function(set){
    return createDataset(isRoot, project)(set)
      .then(addDatasetToProject(project))
      .then(loadChildOrfs)
  })
  .then(function(){
    return project.save()
      .then(function(projectSaved){
        console.log('Project: ' + projectSaved.name + ' updated with new Datasets.')
        return projectSaved;
      });
  })
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
    //readProjects();
  })})})})})})})})})})});
}

/**
 * Checks for presence of analysis folders in ORF folder.
 * @param {Object} orf The Orf
 * @return {Object} Object where each analysis folder found is a property set to true.
 */
function getAnalyses (path) {
  var analyses = {};
  return util.getDirectories(path)
    .then(function(dirs){
      dirs.forEach(function(dir){
        analyses[dir] = true;
      })
      return analyses;
    });
}

function saveObj (obj){
  console.log('ORF: saving orf ' + obj.name)
  return obj.save()
    .then(function(objSaved){
      console.log('ORF: ' + obj.name + ' updated with new analyses and files.')
      return objSaved;
    });
}

/**
 * Loads all analyses associated with an ORF.
 * @param {Object} orf The Orf
 * @return {null}
 */
function loadAnalyses(orf){
  return Promise.resolve(orf)
    .then(loadAnalysisPromised(disoLoad.load, 'disopred', Disopred))
    .then(loadAnalysisPromised(tmhmmLoad.load, 'tmhmm', Tmhmm))
    .then(loadAnalysisPromised(topconsLoad.load, 'topcons', Topcons))
    .then(loadAnalysisPromised(itasserLoad.load, 'itasser', Itasser))
    .then(loadFilesPromised(modelsLoad.load, 'models', Models))
    .then(loadFilesPromised(imagesLoad.load, 'images', Images))
    .then(saveObj)
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
function loadFilesPromised(lf, name, ac){
  return function(orf){
    if(orf.analyses[name]){
      return lf(orf.path, orf.project)
          .then(assignProjectIdMany(orf.project))
          .then(createObjMany(ac,orf,name))
    }else{
      return orf;
    }
  }
}

function loadAnalysisPromised(lf, name, ac){
  return function(orf){
    if(orf.analyses[name]){
      console.log("Analysis: initiating loading for "+name+" in ORF "+ orf.name)
      return lf(orf.path, orf.project)
        .then(util.readMeta)
        .then(assignProjectId(orf.project))
        .then(createObj(ac,orf,name));
    }else{
      return orf;
    }
  }
}

function assignProjectId(project){
  return function(obj){
    obj.project = project;
    return obj;
  }
}

function assignProjectIdMany(project){
  return function(obj){
    obj.map(function(o){
      o.project = project;
    })
    return obj;
  }
}

function createObj(type, orf, name){
  return function(obj){
    console.log('Analysis: saving new ' + name + ' in ORF ' + orf.name)
    return type.create(obj)
      .then(function(created){
        orf.analysis[name] = created._id;
        console.log('Analysis: ' + name + created._id + ' created in ORF ' + orf.name)
        return orf;
      })
  }
}

function createObjMany(type, orf, name){
  return function(obj){
    console.log('Files: saving new ' + name + 's in ORF ' + orf.name)
    return new Promise(function(resolve, reject){
      var count = 0;
      var idList = [];
      obj.forEach(function(f){
        type.create(f, function(err, anaObj){
          if(err){
            reject(err);
          }else {
            console.log('File: ' + name + anaObj._id + ' created in ORF ' + orf.name)
            idList.push(anaObj._id)
            count += 1;
            if(count === obj.length){
              orf.files[name] = idList;
              resolve(orf);
            }
          }
        })
      })
    })
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
