'use strict';

import _ from 'lodash';
import config from '../../../config/environment';

//var util = require('./util');
var path = require('path');
var fs = require('fs');
var lineReader = require('linebyline');
var asy = require('async');
var glob = require("glob");

// Location of data folder
var dataPath = config.data;

function getLineReader(path){
  return lineReader.createInterface({
    input: fs.createReadStream(path)
  });
}

// Get JSON formatted tmhmm
export function getTmhmm(req, res){
  var subPath = path.join(dataPath, req.params.projectId, req.params.dataId, req.params.orfId, 'tmhmm');

  var longFilePath = path.join(subPath, 'tmhmm.long');
  var plpFilePath = path.join(subPath, 'tmhmm.plp');

  asy.waterfall([
    //**************************************************************************
    // Read long output file
    function(callback) {

      var rl = lineReader(longFilePath);

      var lines = []; // Lines read from file
      var data = {}; // Data output

      rl
      .on('error', function (err) {
        return callback(err, null); // Error reading file, abort and return null
      })
      .on('line', function (line) {
        if(line[0]!=='#'){ // ignore first lines
          lines.push(line.split(/\s+/).filter(function(el) {return el.length !== 0}));
        }
      })
      .on('close', function (){
        // List of strings to object
        data.domains = lines.map(function(line){
          return {
            name: line[0],
            version: line[1],
            type: line[2],
            start: Number(line[3]),
            end: Number(line[4])
          }
        });
        callback(null, data);
      });
    },

    //**************************************************************************
    // Read probabilities file
    function(data, callback) {

      var rl = lineReader(plpFilePath);

      var lines = []; // Lines read from file
      var first = true;

      rl
      .on('error', function (err) {
        return callback(err, null); // Error reading file, abort and return null
      })
      .on('line', function (line) {
        if(line[0]!=='#' && line.length>0){ // ignore first lines
          lines.push(line.split(/\s+/).filter(function(el) {return el.length !== 0}));
        }else if (first){
          line = line.split(" ")
          data.name = line[1];
          first = false;
        }
      })
      .on('close', function (){
        // List of strings to object
        data.prob = lines.map(function(line){
          return {
            pos: Number(line[0]),
            amino: line[1],
            inside: Number(line[2]),
            membrane: Number(line[3]),
            outside: Number(line[4])
          }
        });
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
