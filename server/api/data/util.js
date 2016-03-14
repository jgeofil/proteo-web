'use strict';

var fs = require('fs');
var path = require("path");
var glob = require("glob");
var readMultipleFiles = require('read-multiple-files');
var asy = require('async');
import Group from './../group/group.model';
var mongoose = require('bluebird').promisifyAll(require('mongoose'));
/**

**/
// Get all sub-directories in directory
export function getSubDirs(dir, cb) {
  //TODO:waterfall no longer needed
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
                dirs.push(files[i]);
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
    }
  ], function (err, result) {
    cb(result, err);
  });
}

export function isAuthorizedOnGroup(req, res, next) {
  Group.find({users: mongoose.Types.ObjectId(req.user._id)}, function(err,groups){
    //TODO: error
    var permissions = [];
    groups.forEach(function(d){
      permissions = permissions.concat(d.permissions);
    })

    if(permissions.indexOf(req.params.projectId) === -1){
      res.status(403).end();
    }else{
      next();
    }

  });
}


















//a
