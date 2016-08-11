'use strict';

var Originals = require('./originals.model');
var util = require('./../files.util');

/**
 * Get a specific PDB experimental model file.
 * @return {null} request is answered.
 */
export function getModels(req, res){
  util.getOneFileByID(Originals, req, res);
}
