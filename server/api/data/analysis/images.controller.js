'use strict';

import _ from 'lodash';
import config from '../../../config/environment';

//var util = require('./util');
var path = require('path');
var fs = require('fs');
var lineReader = require('linebyline');
var asy = require('async');
var glob = require("glob");
var util = require('./../util');

// Location of data folder
var dataPath = config.data;

function getLineReader(path){
  return lineReader.createInterface({
    input: fs.createReadStream(path)
  });
}

// Get JSON formatted list of all available images
export function getList(req, res){
  var subPath = path.join(dataPath, req.params.projectId, req.params.dataId, req.params.orfId, 'images');

  asy.waterfall([
    //**************************************************************************
    // List all available image files
    function(callback) {

      glob("*.@(png|jpg|jpeg|gif)", {cwd: subPath}, function (err, files) {
        if(err) {
          return callback(err, null);
        }
        if(!files || files.length < 0){
          return callback('No files available...', null);
        }
        files = files.map(function(str){
          return {
            name: str,
            shortName: str.split('.')[0]
          }
        });
        callback(null, files);
      });
    },

    //**************************************************************************
    // Read caption files
    function(data, callback) {
      var count = 0;

      data.forEach(function(file){
        var metaPath = path.join(subPath, file.shortName+'.json');
        util.readMetaDataAsync(metaPath, function(meta){
          file.meta = meta;
          count += 1;
          if (count === data.length){
            callback(null, data);
          }
        })
      })
    }
  ], function (err, result) {

    if(result && ! err){
      res.status(200).json(result);
    }else{
      res.status(404).send("Not found... " + err);
    }

  });

}

// Get image files
export function getImage(req, res){
  var subPath = path.join(dataPath, req.params.projectId, req.params.dataId, req.params.orfId, 'images', req.params.imageName);

  res.sendFile(subPath);
}
