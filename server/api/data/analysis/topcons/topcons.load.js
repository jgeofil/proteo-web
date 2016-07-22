'use strict';

//var util = require('./util');
var path = require('path');
var fs = require('fs');
var lineReader = require('linebyline');
var asy = require('async');
var glob = require("glob");

function addValue(arr, name, pos, val){
  var found = false;
  for(var i = 0; i < arr.length; i++){
    if(arr[i].position === pos){
      found = true;
      arr[i][name] = val;
    }
  }
  if(!found){
    var nel = {
      position: pos
    }
    nel[name]= val;
    arr.push(nel);
  }
}

function addPrediction (data, arr, name){
  arr.forEach(function(d, i){
    if(!data.sequential[i].predictions){
      data.sequential[i].predictions = {};
    }
    data.sequential[i].predictions[name] = d;
  })
}

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
      data.sequential = [];

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
                  addValue(data.sequential, 'zCord', Number(line[0]), Number(line[1]));
                }
                break;
              case 8:
                if(line !== ''){
                  line = line.split(/\s+/);
                  addValue(data.sequential, 'deltaG', Number(line[0]), Number(line[1]));
                }
                break;
              case 9:
                if(line !== ''){
                  line = line.split(/\s+/);
                  addValue(data.sequential, 'topRel', Number(line[0]), Number(line[1]));
                }
                break;
              default:
                break;
            }
        }
      })
      .on('close', function (){
        data.other = {};
        data.other.methods = ['scampiSeq','scampiMsa','prodiv','pro','octopus','topcons']

        addPrediction(data, scampiSeq.split('') ,'scampiSeq')
        addPrediction(data, scampiMsa.split('') ,'scampiMsa')
        addPrediction(data, prodiv.split('') ,'prodiv')
        addPrediction(data, pro.split('') ,'pro')
        addPrediction(data, octopus.split('') ,'octopus')
        addPrediction(data, topcons.split(''),'topcons')

        callback(null, data);
      });
    }
  ], function (err, result) {
    if(result && ! err){
      var obj = {
        data: result
      }
      obj.metadata = {};
      obj.path = subPath;
      console.log(obj)
      callback(obj);
    }else{
      callback(null);
    }

  });

}
