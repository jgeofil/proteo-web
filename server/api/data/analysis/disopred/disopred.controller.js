'use strict';

import config from '../../../../config/environment';

var path = require('path');
var Disopred = require('./disopred.model');

// Location of data folder
var dataPath = config.data;

// Get JSON formatted DISOPRED3 output
export function disopred3(req, res){

  var subPath = path.join(dataPath, req.params.projectId, req.params.dataId, req.params.orfId, 'disopred');

  Disopred.findOne({path: subPath}, function(err,diso){
    if(!err && diso){
      res.status(200).json(diso);
    }else{
      res.status(404).send("Not found");
    }
  });
}
