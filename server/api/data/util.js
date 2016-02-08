'use strict';

var fs = require('fs');
var path = require("path");
var glob = require("glob");
var readMultipleFiles = require('read-multiple-files');
var asy = require('async');
/**

**/
// Get all sub-directories in directory
export function getSubDirs(dir, cb) {

  asy.waterfall([
    //**************************************************************************
    //
    function(callback) {
      fs.readdir(dir, function(err, files) {
        var dirs = [];
        var filePath;
        var checkDirectory = function (i,l){
          return function(err, stat) {
            if(stat.isDirectory()) {
                dirs.push({name:files[i]});
            }
            if(i + 1 === l) { // last record
              callback(err,dirs);
            }
          };
        };

        if(files){
          for(var i=0, l=files.length; i<l; i++) {
            if(files[i][0] !== '.') { // ignore hidden
              filePath = path.join(dir,files[i]);
              fs.stat(filePath, checkDirectory(i, l));
            }
          }
        }else{
          return callback('Not found!', []);
        }
      });
    },

    //**************************************************************************
    //
    function(data, callback) {
      /**
      readMultipleFiles(['one.txt', 'another.txt'], (err, bufs) => {
        if (err) {
          throw err;
        }

        bufs; //=> [<Buffer ... >, <Buffer ... >]
      });
      **/

      callback(null,data);

    }
  ], function (err, result) {
    cb(result, err);
  });

}



















//a
