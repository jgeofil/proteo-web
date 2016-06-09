'use strict';

import _ from 'lodash';
import config from '../../../../config/environment';

var path = require('path');
var Models = require('./models.model');
var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Grid = require('gridfs-stream');

var conn = mongoose.connection;
Grid.mongo = mongoose.mongo;
var gfs = new Grid(conn.db);

// Location of data folder
var dataPath = config.data;

/**
 * Get list of all available experimental models for the ORF.
 * @return {null} request is answered.
 */
export function getList(req, res){
  var subPath = path.join(dataPath, req.params.projectId, req.params.dataId, req.params.orfId, 'models');

  Models.findOne({path: subPath}, function(err,models){
    if(!err && models){
      res.status(200).json(models);
    }else{
      res.status(404).send("Not found");
    }
  });

}

/**
 * Get a specific PDB experimental model file.
 * @return {null} request is answered.
 */
export function getModels(req, res){
  var subPath = path.join(dataPath, req.params.projectId, req.params.dataId, req.params.orfId, 'models');

  Models.findOne({path: subPath}, function(err,models){
    if(!err && models){
      var found = false;
      models.data.forEach(function(mod){
        if(mod.shortName === req.params.modelName){
          found = true;
          var readstream = gfs.createReadStream({
            _id: mod.pdbId
          });
          readstream.on('error', function (err) {
            res.send(500, err);
          });
          readstream.pipe(res);
        }
      })
      if(!found){
        res.status(404).send("Not found");
      }
    }else{
      res.status(404).send("Not found");
    }
  });

}
