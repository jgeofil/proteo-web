'use strict';

import config from '../../../../config/environment';

var path = require('path');
var Tmhmm = require('./tmhmm.model');

// Location of data folder
var dataPath = config.data;

/**
 * Get disopred output in original text format.
 * @return {null} request is answered.
 */
export function original(req, res){

  var subPath = path.join(dataPath, req.params.projectId, req.params.dataId, req.params.orfId, 'tmhmm');

  switch (req.params.fileName) {
    case 'tmhmm.long':
      res.sendFile(path.join(subPath, 'tmhmm.long'));
      break;
    case 'tmhmm.plp':
      res.sendFile(path.join(subPath, 'tmhmm.plp'));
      break;
    default:
      res.status(404).send("Not found");
  }

}
