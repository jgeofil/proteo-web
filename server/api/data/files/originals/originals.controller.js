'use strict';

var Originals = require('./originals.model');
var util = require('./../files.util');

/**
 * Get a specific  file.
 * @return {null} request is answered.
 */
export function getOriginals(req, res){
  util.getOneFileByID(Originals, req, res);
}
