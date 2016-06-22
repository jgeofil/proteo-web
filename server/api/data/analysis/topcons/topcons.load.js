'use strict';

//var util = require('./util');
var path = require('path');
var fs = require('fs');
var lineReader = require('linebyline');
var asy = require('async');
var glob = require("glob");

export function load(orfpath, callback){

  var subPath = path.join(orfpath, 'topcons');
  var topFilePath = path.join(subPath, 'topcons.txt');

  asy.waterfall([
    //**************************************************************************
    // Read long output file
    function(callback) {

      var rl = lineReader(topFilePath);

      var scampiSeq = '';
      var scampiMsa = '';
      var prodiv = '';
      var pro = '';
      var octopus = '';
      var topcons = '';

      var data = {};
      data.zCord = [];
      data.deltaG = [];
      data.topRel = [];

      var state = 0;

      rl
      .on('error', function (err) {
        return callback(err, null); // Error reading file, abort and return null
      })
      .on('line', function (line) {
        var lineStart = line.substring(0,11)
        switch (lineStart) {
          case 'SCAMPI-seq ':
            state = 1;
            break;
          case 'SCAMPI-msa ':
            state = 2;
            break;
          case 'PRODIV pred':
            state = 3;
            break;
          case 'PRO predict':
            state = 4;
            break;
          case 'OCTOPUS pre':
            state = 5;
            break;
          case 'TOPCONS pre':
            state = 6;
            break;
          case 'Predicted Z':
            state = 7;
            break;
          case 'Predicted D':
            state = 8;
            break;
          case 'Predicted T':
            state = 9;
            break;
          default:
            switch (state) {
              case 1:
                scampiSeq += line
                break;
              case 2:
                scampiMsa += line
                break;
              case 3:
                prodiv += line
                break;
              case 4:
                pro += line
                break;
              case 5:
                octopus += line
                break;
              case 6:
                topcons += line
                break;
              case 7:
                if(line !== ''){
                  line = line.split(/\s+/);
                  data.zCord.push({
                    pos: Number(line[0]),
                    value: Number(line[1])
                  });
                  }
                break;
              case 8:
                if(line !== ''){
                  line = line.split(/\s+/);
                  data.deltaG.push({
                    pos: Number(line[0]),
                    value: Number(line[1])
                  });
                }
                break;
              case 9:
                if(line !== ''){
                  line = line.split(/\s+/);
                  data.topRel.push({
                    pos: Number(line[0]),
                    value: Number(line[1])
                  });
                }
                break;
              default:
                break;
            }
        }
      })
      .on('close', function (){
        data.predictions = [];

        data.predictions.push({
          method: 'scampiSeq',
          values: scampiSeq.split('')
        });
        data.predictions.push({
          method: 'scampiMsa',
          values: scampiMsa.split('')
        });
        data.predictions.push({
          method: 'prodiv',
          values: prodiv.split('')
        });
        data.predictions.push({
          method: 'pro',
          values: pro.split('')
        });
        data.predictions.push({
          method: 'octopus',
          values: octopus.split('')
        });
        data.predictions.push({
          method: 'topcons',
          values: topcons.split('')
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
      callback(null);
    }

  });

}
