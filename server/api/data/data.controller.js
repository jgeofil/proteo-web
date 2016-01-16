'use strict';

import _ from 'lodash';

var util = require('./util');

var fs = require('fs');
var path = require("path");

//TODO: Modifier pour process.env.DATAPATH
var dataPath = path.join(__dirname, '/../../data/');

// Gets a list of available data sets
export function index(req, res) {
  util.getSubDirs(dataPath, function(dirs, err){
    if(err){
      res.status(500).send(err);
    }else{
      res.status(200).json(dirs);
    }
  });
}
