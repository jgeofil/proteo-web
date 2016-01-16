'use strict';

import _ from 'lodash';

//var util = require('./util');
var path = require('path');
var fs = require('fs');
var fasta = require('bionode-fasta');
var lineReader = require('readline');
var asy = require('async');
var glob = require("glob");

//TODO: Modifier pour process.env.DATAPATH
var dataPath = path.join(__dirname, '/../../../data/');


// Get JSON formatted list of all available models for the analysis
export function listModels(req, res){
  var subPath = path.join(dataPath, req.params.dataId, req.params.orfId, 'i-tasser');

  glob("model*.pdb", {cwd: subPath}, function (err, files) {
    if(err) {
      res.status(500).send(err);
    }
    if(!files || files.length < 0){
      res.status(404).send("Not found");
    }
    files = files.map(function(str){return str.split('.')[0];});
    res.status(200).json(files);
  });
}

// Get JSON formatted list of all available models for the analysis
export function getModel(req, res){
  var subPath = path.join(dataPath, req.params.dataId, req.params.orfId, 'i-tasser', req.params.modelName+'.pdb');

  fs.readFile(subPath, 'utf8', function(err, contents) {
    if(err) {
      res.status(500).send(err);
    }
    res.status(200).send(contents);
  });
}
