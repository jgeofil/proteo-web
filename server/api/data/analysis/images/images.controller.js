'use strict';

import _ from 'lodash';
import config from '../../../../config/environment';

var path = require('path');
var Images = require('./images.model');
var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Grid = require('gridfs-stream');

var conn = mongoose.connection;
Grid.mongo = mongoose.mongo;
var gfs = new Grid(conn.db);

// Location of data folder
var dataPath = config.data;

/**
 * Get list of all available experimental images for the ORF.
 * @return {null} request is answered.
 */
export function getList(req, res){
  var subPath = path.join(dataPath, req.params.projectId, req.params.dataId, req.params.orfId, 'images');

  Images.findOne({path: subPath}, function(err,images){
    if(!err && images){
      res.status(200).json(images);
    }else{
      res.status(404).send("Not found");
    }
  });

}

/**
 * Get a specific PDB experimental model file.
 * @return {null} request is answered.
 */
export function getImages(req, res){
  var subPath = path.join(dataPath, req.params.projectId, req.params.dataId, req.params.orfId, 'images');

  Images.findOne({path: subPath}, function(err,images){
    if(!err && images){
      var found = false;
      images.data.forEach(function(mod){
        if(mod.name === req.params.imageName){
          found = true;
          var readstream = gfs.createReadStream({
            _id: mod.gridFile
          });
          readstream.on('error', function (err) {
            console.log(err)
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
