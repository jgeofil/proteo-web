'use strict';

//var util = require('./util');
var path = require('path');
var fs = require('fs');
var lineReader = require('linebyline');
var asy = require('async');
var glob = require("glob");

export function load(orfpath, callback){

  var subPath = path.join(orfpath, 'tmhmm');

  var longFilePath = path.join(subPath, 'tmhmm.long');
  var plpFilePath = path.join(subPath, 'tmhmm.plp');

  asy.waterfall([
    //**************************************************************************
    // Read long output file
    function(callback) {

      var rl = lineReader(longFilePath);

      var lines = []; // Lines read from file
      var data = {}; // Data output
      data.data = {discrete:{}};

      rl
      .on('error', function (err) {
        return callback(err, null); // Error reading file, abort and return null
      })
      .on('line', function (line) {
        if(line[0]!=='#'){ // ignore first lines
          lines.push(line.split(/\s+/).filter(function(el) {return el.length !== 0}));
        }else{
          var l = line.split(/\s+/).filter(function(el) {return el.length !== 0});
          switch (l[5]) {

            case 'TMHs:':
              data.data.discrete.numberPredictedTMH = Number(l[6]);
              break;
            case 'AAs':
              data.data.discrete.expectedNumberAAInTMH = Number(l[8]);
              break;
            case '60':
              data.data.discrete.expectedNumberAAFirst60 = Number(l[7]);
              break;
            case 'N-in:':
              data.data.discrete.totalProbNin = Number(l[6]);
              break;
            default:

          }
        }
      })
      .on('close', function (){
        // List of strings to object

        data.data.domains = lines.map(function(line){
          return {
            //name: line[0],
            //version: line[1],
            name: line[2],
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
          //data.name = line[1];
          first = false;
        }
      })
      .on('close', function (){
        // List of strings to object
        data.data.sequential = lines.map(function(line){
          return {
            position: Number(line[0]),
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
      result.metadata = {};
      result.path = subPath;
      callback(result);
    }else{
      callback(null)
    }

  });

}
