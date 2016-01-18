'use strict';

import _ from 'lodash';

//var util = require('./util');
var path = require('path');
var fs = require('fs');
var lineReader = require('readline');
var asy = require('async');
var glob = require("glob");

//TODO: Modifier pour process.env.DATAPATH
var dataPath = path.join(__dirname, '/../../../../data/');

function getLineReader(path){
  return lineReader.createInterface({
    input: fs.createReadStream(path)
  });
}

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

// Get JSON formatted output
export function getPredictions(req, res){
  var subPath = path.join(dataPath, req.params.dataId, req.params.orfId, 'i-tasser');

  var ssFilePath = path.join(subPath, 'seq.ss');

  asy.waterfall([
    //**************************************************************************
    // Read secondary sequence file
    function(callback) {

      var rl = getLineReader(ssFilePath);
      var lines = [];
      var data = {};
      var first = true;

      rl
      .on('line', function (line) {
        if(!first){ // ignore first line
          lines.push(line.split(' ').filter(function(el) {return el.length !== 0}));
        }else{
          first = false;
        }
      })
      .on('close', function (){
        data.ss = {};

        data.ss = lines.map(function(line){
          return {
            pos: Number(line[0]),
            amino: line[1],
            symbol: line[2],
            confidence: {
              coil: Number(line[3]),
              helix: Number(line[4]),
              beta: Number(line[5]),
            }
          }
        });
        callback(null, data);
      });
      //TODO: on error...
    },
    //**************************************************************************
    // Read other file
    function(data, callback) {
      callback(null, data);
    }
  ], function (err, result) {

    if(result && ! err){
      res.status(200).json(result);
    }else{
      res.status(404).send("Not found");
    }

  });

}
