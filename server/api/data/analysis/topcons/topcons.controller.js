'use strict';

import config from '../../../../config/environment';

var path = require('path');
var Topcons = require('./topcons.model');

// Location of data folder
var dataPath = config.data;


/**
 * Get tmhmm output in original text format.
 * @return {null} request is answered.
 */
export function original(req, res){

  var subPath = path.join(dataPath, req.params.projectId, req.params.dataId, req.params.orfId, 'topcons');

  switch (req.params.fileName) {
    case 'topcons.txt':
      res.sendFile(path.join(subPath, 'topcons.txt'));
      break;
    default:
      res.status(404).send("Not found");
  }

}
