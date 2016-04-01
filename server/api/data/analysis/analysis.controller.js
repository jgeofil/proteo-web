'use strict';

import _ from 'lodash';
import config from '../../../config/environment';

var util = require('./../util');
var path = require('path');
var fs = require('fs');

// Location of data folder
var dataPath = config.data;

// Gets a list of available analysis
export function index(req, res) {

  var subPath = path.join(dataPath, req.params.dataId, req.params.orfId);

  util.getSubDirs(subPath, function(dirs, err){
    if(err){
      res.status(500).send(err);
    }else{
      res.status(200).json(dirs);
    }
  });
}

// Gets metadata for ORF
export function metadata(req, res) {
  res.status(200).json(req.params.metadata);
}
