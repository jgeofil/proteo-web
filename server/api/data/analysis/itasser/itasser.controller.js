'use strict';

import config from '../../../../config/environment';

var path = require('path');
var fs = require('fs');
var Itasser = require('./itasser.model');
var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Grid = require('gridfs-stream');

var conn = mongoose.connection;
Grid.mongo = mongoose.mongo;
var gfs = new Grid(conn.db);

// Location of data folder
var dataPath = config.data;

/**
 * Get PDB format models.
 * TODO: should be GLOBS
 * @return {null} request is answered.
 */
export function getModel(req, res){

  var dataString = '';
  var readstream = gfs.createReadStream({
    _id: req.params.modelId
  });
  readstream.on('error', function (err) {
    res.send(500, err);
  });
  readstream.on('data',function(part){
    dataString += part;
  });
  readstream.on('end',function(){
    gfs.findOne({ _id: req.params.modelId}, function (err, file) {
      file.data = dataString;
      res.send(file);
    });
  });

}

/**
 * Get I-TASSER output in original text format.
 * @return {null} request is answered.
 */
export function original(req, res){

  var subPath = path.join(dataPath, req.params.projectId, req.params.dataId, req.params.orfId, 'itasser');

  switch (req.params.fileName) {
    case 'seq.ss':
      res.sendFile(path.join(subPath, 'seq.ss'));
      break;
    case 'coverage':
      res.sendFile(path.join(subPath, 'coverage'));
      break;
    case 'cscore':
      res.sendFile(path.join(subPath, 'cscore'));
      break;
    default:
      res.status(404).send("Not found");
  }

}
