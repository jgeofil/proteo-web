'use strict';

//var util = require('./util');
var path = require('path');
var asy = require('async');
var glob = require("glob");
var util = require('./../../util');
var fs = require('fs');
var Grid = require('gridfs-stream');
var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var conn = mongoose.connection;
Grid.mongo = mongoose.mongo;
var gfs = new Grid(conn.db);

export function load(orfpath, callback){

  var subPath = path.join(orfpath, 'models');

  asy.waterfall([
    //**************************************************************************
    // List all available model files
    function(callback) {

      glob("*.@(pdb|PDB)", {cwd: subPath}, function (err, files) {
        console.log(files)
        if(err) {
          return callback(err, null);
        }
        if(!files || files.length < 0){
          return callback('No files available...', null);
        }
        files = files.map(function(str){
          return {
            name: str,
            shortName: str.split('.')[0],
            path: path.join(subPath, str)
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
          file.metadata = meta;
          count += 1;
          if (count === data.length){
            callback(null, data);
          }
        })
      })
    },

    //**************************************************************************
    // Create GRIDfs objects
    function(data, callback) {
      var count = 0;

      data.forEach(function(file){
        // streaming to gridfs
        //filename to store in mongodb
        var writestream = gfs.createWriteStream({
            filename: file.name
        });
        fs.createReadStream(file.path).pipe(writestream);

        writestream.on('close', function (gfsfile) {
            // do something with `file`
            file.pdbId = gfsfile._id;
            count += 1;
            if (count === data.length){
              callback(null, data);
            }
        });
      })
    }
  ], function (err, result) {
    console.log(result)

    if(result && !err){
      callback({
        data: result,
        path: subPath
      });
    }else{
      callback(null);
    }

  });

}
