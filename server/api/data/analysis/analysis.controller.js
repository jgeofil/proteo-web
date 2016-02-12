'use strict';

import _ from 'lodash';

var util = require('./../util');
var path = require('path');
var fs = require('fs');

//TODO: Modifier pour process.env.DATAPATH
var dataPath = path.join(__dirname, '/../data/');


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
