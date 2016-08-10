'use strict';

var Models = require('./models.model');
var util = require('./../files.util');

/**
 * Get a specific PDB experimental model file.
 * @return {null} request is answered.
 */
export function getModels(req, res){
  util.getOneFileByID(Models, req, res);
}
