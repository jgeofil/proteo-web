'use strict';

import _ from 'lodash';
import config from '../../config/environment';
import Group from './../group/group.model';
import User from './../user/user.model';
import Data from './data.model';

var os = require('os');

var dl = require('./data.load');
dl.load();

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var path = require('path');

// Location of data folder
var DATA_PATH = config.data;

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
    .populate('analysis.disopred', 'data.discrete sequence')
    .populate('analysis.tmhmm', 'data.discrete sequence')
    .populate('project', '_id name')
    .populate('dataset', '_id name')
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
    .populate('project', '_id name')
    .populate('dataset', '_id name')
    .exec(function(err, orf){
      if(!err && orf){
        res.status(200).json(orf);
      }else{
        res.status(500).send("Error reading ORFs.");
      }
    })
}

/**
 * Get all available information for an ORF, including analysis results.
 * @return {null} request is answered.
 */
export function fullOrf(req, res) {
  var subPath = path.join(DATA_PATH, req.params.projectId, req.params.dataId, req.params.orfId);

  Data.Orf
    .findOne({path: subPath})
    .populate('analysis.disopred')
    .populate('analysis.tmhmm')
    .populate('analysis.itasser')
    .populate('analysis.topcons')
    .populate('files.models')
    .populate('files.images')
    .populate('project', '_id name')
    .populate('dataset', '_id name')
    //TODO: populate other analyses when they will be preloaded.
    .exec(function(err, orf){
      if(!err && orf){


        res.status(200).json(orf);
      }else{
        res.status(500).send("Error reading ORF.");
      }
    })
}

/**
 * Get FASTA formatted sequence file for an ORF
 * @return {null} request is answered.
 */
export function oneOrfSequence(req, res) {
  var subPath = path.join(DATA_PATH, req.params.projectId, req.params.dataId, req.params.orfId);

  Data.Orf
    .findOne({path: subPath})
    .exec(function(err, orf){
      if(!err && orf){
        var fasta = '';
        orf.sequence.forEach(function(s,i){
          fasta = fasta + ">" + req.params.orfId + '|v' + i + os.EOL;
          var sp = s.match(/.{1,80}/g);
          sp.forEach(function(p){
            fasta = fasta + p + os.EOL
          });
        });

        res.status(200).send(fasta);
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
  dl.update();
  console.log("DataUpdated as per request")
  res.status(200).send("Done.");
}
