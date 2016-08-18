'use strict';

import _ from 'lodash';
import config from '../../config/environment';
import Group from './../group/group.model';
import User from './../user/user.model';
import Data from './data.model';

var os = require('os');
var dl = require('./data.load');
var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Apu = require('./../api.util');

dl.load();


function setPermissionsOnProjects (req, permissions){
  return function(projects){
    projects.forEach(function(d){
      if(permissions.indexOf(d.name) !== -1 || req.user.role === 'admin'){
        d.authorized = true;
      }
    });
    return projects;
  }
}

function getProjectsAndSetPermissions  (req, res){
  return function (permissions){
    return Data.Project.find({})
      .then(Apu.handleEntityNotFound(res))
      .then(setPermissionsOnProjects(req, permissions))
  }
}

function populateOriginals(orf){
  return Data.Orf.populate(orf, [
    {
      path: 'analysis.disopred.originals',
      model: 'Originals'
    },{
      path: 'analysis.topcons.originals',
      model: 'Originals'
    },{
      path: 'analysis.itasser.originals',
      model: 'Originals'
    },{
      path: 'analysis.tmhmm.originals',
      model: 'Originals'
    },{
      path: 'analysis.itasser.data.other.models',
      model: 'Models'
    }
  ]);
}

function produceFasta (orf){
  var fasta = '';
  orf.sequence.forEach(function(s,i){
    fasta = fasta + ">" + orf.name + '|v' + i + os.EOL;
    var sp = s.match(/.{1,80}/g);
    if(sp){
      sp.forEach(function(p){
        fasta = fasta + p + os.EOL
      });
    }
  });
  return fasta;
}



//******************************************************************************
// Exports
//******************************************************************************
/**
 * // Gets a list of available Projects.
 * @return {null} request is answered.
 */
export function index(req, res) {
  Group.find({users: mongoose.Types.ObjectId(req.user._id)})
    .then(Apu.handleEntityNotFound(res))
    .then(Apu.combineGroups)
    .then(getProjectsAndSetPermissions(req, res))
    .then(Apu.responseWithResult(res))
    .catch(Apu.handleError(res))
}

/**
 * Gets a list of available Orfs in a Dataset.
 * @return {null} request is answered.
 */
export function orfs(req, res) {
  Data.Orf.find({dataset: req.params.dataId})
    .populate('analysis.disopred', 'data.discrete sequence')
    .populate('analysis.tmhmm', 'data.discrete sequence')
    .populate('project', '_id name')
    .populate('dataset', '_id name')
    .then(Apu.userIsAuthorizedAtProjectLevel(req,res))
    .then(Apu.responseWithResult(res))
    .catch(Apu.handleError(res))
}

/**
 * Get all available information for an ORF, including analysis results.
 * @return {null} request is answered.
 */
export function fullOrf(req, res) {
  Data.Orf
    .findOne({_id: req.params.orfId})
    .populate('analysis.disopred')
    .populate('analysis.tmhmm')
    .populate('analysis.itasser')
    .populate('analysis.topcons')
    .populate('files.models')
    .populate('files.images')
    .populate('project', '_id name')
    .populate('dataset', '_id name')
    .then(populateOriginals)
    .then(Apu.userIsAuthorizedAtProjectLevel(req,res))
    .then(Apu.responseWithResult(res))
    .catch(Apu.handleError(res))
}

/**
 * Get FASTA formatted sequence file for an ORF
 * @return {null} request is answered.
 */
export function oneOrfSequence(req, res) {
  Data.Orf
    .findOne({_id: req.params.orfId})
    .then(Apu.userIsAuthorizedAtProjectLevel(req,res))
    .then(produceFasta)
    .then(Apu.responseWithResult(res))
    .catch(Apu.handleError(res))
}

/**
 * Gets a list of available Datasets in a Project.
 * @return {null} request is answered.
 */
export function datasets(req, res) {
  Data.Dataset.find()
    .populate('orfs')
    .then(Apu.userIsAuthorizedAtProjectLevel(req,res))
    .then(Apu.responseWithResult(res))
    .catch(Apu.handleError(res))
}

export function update(req, res){
  dl.update();
  console.log("DataUpdated as per request")
  res.status(200).send("Done.");
}
