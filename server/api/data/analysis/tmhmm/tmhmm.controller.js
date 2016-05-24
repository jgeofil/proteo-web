'use strict';

import config from '../../../../config/environment';

var path = require('path');
var Tmhmm = require('./tmhmm.model');

// Location of data folder
var dataPath = config.data;

// Get JSON formatted DISOPRED3 output
export function tmhmm(req, res){

  var subPath = path.join(dataPath, req.params.projectId, req.params.dataId, req.params.orfId, 'tmhmm');

  Tmhmm.findOne({path: subPath}, function(err,tmhmm){
    if(!err && tmhmm){
      res.status(200).json(tmhmm);
    }else{
      res.status(404).send("Not found");
    }
  });

}
