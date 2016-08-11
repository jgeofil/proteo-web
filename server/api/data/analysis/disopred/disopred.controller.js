'use strict';

import config from '../../../../config/environment';

var path = require('path');
var Disopred = require('./disopred.model');

// Location of data folder
var dataPath = config.data;

/**
 * Get disopred output in original text format.
 * @return {null} request is answered.
 */
export function original(req, res){

  var subPath = path.join(dataPath, req.params.projectId, req.params.dataId, req.params.orfId, 'disopred');

  switch (req.params.fileName) {
    case 'disopred.seq.diso':
      res.sendFile(path.join(subPath, 'disopred.seq.diso'));
      break;
    case 'disopred.seq.pbdat':
      res.sendFile(path.join(subPath, 'disopred.seq.pbdat'));
      break;
    default:
      res.status(404).send("Not found");
  }

}
