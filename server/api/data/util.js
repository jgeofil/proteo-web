'use strict';

var fs = require('fs');
var path = require("path");

// Get all sub-directories in directory
export function getSubDirs(dir, cb) {
  fs.readdir(dir, function(err, files) {
    var dirs = [];
    var filePath;
    var checkDirectory = function (i,l){
      return function(err, stat) {
        if(stat.isDirectory()) {
            dirs.push(files[i]);
        }
        if(i + 1 === l) { // last record
          cb(dirs,err);
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
      cb([], "Not found!")
    }
  });
}
