'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Grid = require('gridfs-stream');
var util = require('./../util');
var conn = mongoose.connection;
Grid.mongo = mongoose.mongo;
var gfs = new Grid(conn.db);
var Apu = require('./../../api.util');

function getGridFile(res){
  return function(file){
    var readstream = gfs.createReadStream({
      _id: file.gridFile
    });
    readstream.on('error', function (err) {
      res.send(500, err);
    });
    return readstream.pipe(res);
  }
}

export function getOneFileByID (type, req, res){
  type.findOne({_id: req.params.fileId})
    .then(Apu.handleEntityNotFound(res))
    .then(Apu.userIsAuthorizedAtProjectLevel(req,res))
    .then(getGridFile(res))
    .catch(Apu.handleError(res))
}
