'use strict';

import _ from 'lodash';
import config from '../../../config/environment';

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
export function getTopcons(req, res){
  var subPath = path.join(dataPath, req.params.dataId, req.params.orfId, 'topcons');

  var topFilePath = path.join(subPath, 'topcons.txt');
  var plpFilePath = path.join(subPath, req.params.orfId+'.plp');

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
      data.zcord = [];
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
                  data.zcord.push(Number(line.split(/\s+/)[1]));
                  }
                break;
              case 8:
                if(line !== ''){
                  line = line.split(/\s+/);
                  data.deltaG.push(Number(line[1]));
                }
                break;
              case 9:
                if(line !== ''){
                  line = line.split(/\s+/);
                  data.topRel.push(Number(line[1]));
                }
                break;
              default:
                break;
            }
        }
      })
      .on('close', function (){
        data.pred = [];

        data.pred.push({
          method: 'scampiSeq',
          values: scampiSeq.split('')
        });
        data.pred.push({
          method: 'scampiMsa',
          values: scampiMsa.split('')
        });
        data.pred.push({
          method: 'prodiv',
          values: prodiv.split('')
        });
        data.pred.push({
          method: 'pro',
          values: pro.split('')
        });
        data.pred.push({
          method: 'octopus',
          values: octopus.split('')
        });
        data.pred.push({
          method: 'topcons',
          values: topcons.split('')
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
