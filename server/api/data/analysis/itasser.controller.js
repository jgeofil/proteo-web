'use strict';

import _ from 'lodash';

//var util = require('./util');
var path = require('path');
var fs = require('fs');
var lineReader = require('linebyline');
var asy = require('async');
var glob = require("glob");

//TODO: Modifier pour process.env.DATAPATH
var dataPath = path.join(__dirname, '/../../../data/');

function getLineReader(path){
  return lineReader.createInterface({
    input: fs.createReadStream(path)
  });
}

// Get JSON formatted list of all available models for the analysis
export function listModels(req, res){
  var subPath = path.join(dataPath, req.params.dataId, req.params.orfId, 'i-tasser');
  var cscorePath = path.join(subPath, 'cscore');

  asy.waterfall([
    //**************************************************************************
    // List all available model files
    function(callback) {

      glob("model*.pdb", {cwd: subPath}, function (err, files) {
        if(err) {
          return callback(err, null);
        }
        if(!files || files.length < 0){
          return callback('No files available...', null);
        }
        files = files.map(function(str){
          return {
            name: str.split('.')[0]
          }
        });
        callback(null, files);
      });
    },

    //**************************************************************************
    // Read cscore file
    function(data, callback) {
      var rl = lineReader(cscorePath);

      var lines = [];
      var pos = 0;

      rl
      .on('error', function (err) {
        return callback(err, data);
      })
      .on('line', function (line) {
        switch(pos){
          // Ignore header line
          case 0:
            if(line.substring(0,3) === '---'){ pos+=1; }
            break;
          default:
            var colArray = line.split(' ')
                            .filter(function(el) {return el.length !== 0});
            var len = colArray.length;
            if(len > 3){
              data.forEach(function(model){
                if(model.name === colArray[0]){
                  model.cscore = Number(colArray[1]);
                  if(len === 4){
                    model.decoys = Number(colArray[2]);
                    model.density = Number(colArray[3]);
                  }else if(len === 6){
                    model.tm = colArray[2];
                    model.rmsd = colArray[3];
                    model.decoys = Number(colArray[4]);
                    model.density = Number(colArray[5]);
                  }
                }
              })
            }
            break;
        }
      })
      .on('close', function (){
        callback(null, data);
      });

    }
  ], function (err, result) {

    if(result && ! err){
      res.status(200).json(result);
    }else{
      res.status(404).send("Not found");
    }

  });

}

// Get PDB format models
export function getModel(req, res){
  var subPath = path.join(dataPath, req.params.dataId, req.params.orfId, 'i-tasser', req.params.modelName+'.pdb');

  fs.readFile(subPath, 'utf8', function(err, contents) {
    if(err) {
      res.status(500).send(err);
    }
    res.status(200).send(contents);
  });
}

// Get secondary sequence
export function getPredictions(req, res){
  var subPath = path.join(dataPath, req.params.dataId, req.params.orfId, 'i-tasser');

  var ssFilePath = path.join(subPath, 'seq.ss');
  var alignFilePath = path.join(subPath, 'coverage');

  asy.waterfall([
    //**************************************************************************
    // Read secondary sequence file
    function(callback) {

      var rl = lineReader(ssFilePath);

      var lines = [];
      var data = {};
      var first = true;

      rl
      .on('error', function (err) {
        return callback(err, data);
      })
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
    // Read alignement file
    function(data, callback) {
      var rl = lineReader(alignFilePath);

      var lines = [];
      var pos = 0;
      var method;
      data.align = {};
      data.align.coverage = [];

      rl
      .on('error', function (err) {
        return callback(err, data);
      })
      .on('line', function (line) {
        switch(pos){
          // Ignore header line
          case 0:
            if(line.substring(0,2) === 'M:'){
              method = line.substring(3).split(', ')
              method = method.map(function(met){
                return met.substring(2)
              });
            }
            if(line.substring(0,3) === 'Rnk'){ pos+=1; }
            break;
          // Retrieve secondary structure line
          case 1:
            data.align.ss = line.split(' ')
                              .filter(function(el) {return el.length !== 0})[0]
            pos+=1;
            break;
          // Retrieve sequence line
          case 2:
            data.align.seq = line.split(' ')
                              .filter(function(el) {return el.length !== 0})[0]
            pos+=1;
            break;
          // Retrieve all other alignement lines
          default:
            var colArray = line.split(' ')
                            .filter(function(el) {return el.length !== 0});
            if(colArray.length > 5){
              data.align.coverage.push({
                rank: Number(colArray[0]),
                pdbid: colArray[1],
                zz0: Number(colArray[2]),
                method: method[Number(colArray[3].replace(':', ''))-1],
                cov: colArray[4]
              });
            }
            break;
        }
      })
      .on('close', function (){
        callback(null, data);
      });
    }
  ], function (err, result) {

    if(result && ! err){
      res.status(200).json(result);
    }else{
      res.status(404).send("Not found");
    }

  });

}
