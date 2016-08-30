'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
var gfs = new Grid(mongoose.connection.db);
var BPromise = require("bluebird");

import Data from './data.model';
import Disopred from './analysis/disopred/disopred.model';
import Tmhmm from './analysis/tmhmm/tmhmm.model';
import Topcons from './analysis/topcons/topcons.model';
import Itasser from './analysis/itasser/itasser.model';
import Files from './files/files.model';

function logMessage (message){
  return function (passOn){
    console.log(message);
    return passOn;
  }
}

function removeMongooseInstance (instance){
  return instance.remove();
}

function removeAnalysisMongooseInstance (orf, name, type){
  return type.findOne({_id: orf.analysis[name]})
    .then(removeMongooseInstance)
    .then(logMessage('Type '+name+' analysis removed: '+ orf.analysis[name]))
}

function removeGridFile (parentFile){
  gfs.remove({_id: parentFile.gridFile}, function (err) {
    if (err) throw new Error('Grid file ' + parentFile.gridFile + ' could not be removed.');
    else{
      console.log("Grid file removed: "+parentFile._id+' -> '+ parentFile.gridFile);
      return parentFile;
    }
  });
}

function removeFile (id){
  return Files.findOne({_id: id})
    .then(removeMongooseInstance)
    .then(removeGridFile);
}

function removeFiles(idList){
  return BPromise.each(idList, function(f){
    return removeFile(f);
  })
}

function removeAnalysis (name, type){
  return function (orf){
    if(orf.analysis[name]){
      return removeAnalysisMongooseInstance(orf, name, type)
        .then(removeAnalysisFiles)
        .then(next(orf))
    }else{
      return orf;
    }
  }
}

function removeAnalysisFiles(analysis){
  var files = [];
  files = files.concat(analysis.originals?analysis.originals:[]);
  if(analysis.data.other){
    files = files.concat(analysis.data.other.models?analysis.data.other.models:[])
  }
  console.log('Removing files for Analysis '+analysis._id+': '+files);
  return removeFiles(files);
}

function removeOrfFiles(orf){
  var files = [];
  if(orf.files){
    files = files.concat(orf.files.models?orf.files.models:[])
    files = files.concat(orf.files.images?orf.files.images:[])
  }
  console.log('Removing files for ORF '+orf.name+': '+files);
  return removeFiles(files).then(next(orf))
}

function next(instance){
  return function(){
    return instance;
  }
}

export function removeOrf(id){
  return Data.Orf.findOne({_id: id})
    .then(removeMongooseInstance)
    .then(removeIdFromDataset)
    .then(removeOrfFiles)
    .then(removeAnalysis('itasser', Itasser))
    .then(removeAnalysis('disopred', Disopred))
    .then(removeAnalysis('topcons', Topcons))
    .then(removeAnalysis('tmhmm', Tmhmm));
}

function removeOrfs (dataset){
  var idList = dataset.orfs;
  return BPromise.each(idList, function(f){
    return removeOrf(f);
  })
}

function removeDatasets (project){
  var idList = project.datasets;
  return BPromise.each(idList, function(f){
    return removeDataset(f);
  })
}

export function removeDataset(id){
  return Data.Dataset.findOne({_id: id})
    .then(removeMongooseInstance)
    .then(removeIdFromProject)
    .then(removeOrfs);
}

export function removeProject(id){
  return Data.Project.findOne({_id: id})
    .then(removeMongooseInstance)
    .then(removeDatasets);
}

function removeIdFromDataset(orf){
  return Data.Dataset.findOne({_id: orf.dataset})
    .then(function(dataset){
      if(dataset){
        var index = dataset.orfs.indexOf(orf._id);
        if (index > -1) {
          dataset.orfs.splice(index, 1);
        }
        return dataset.save();
      }else{
        return orf;
      }
    }).then(next(orf))
}

function removeIdFromProject(dataset){
  return Data.Project.findOne({_id: dataset.project})
    .then(function(project){
      if(project){
        var index = project.datasets.indexOf(dataset._id);
        if (index > -1) {
          project.datasets.splice(index, 1);
        }
        return project.save();
      }else{
        return dataset;
      }
    }).then(next(dataset))
}
