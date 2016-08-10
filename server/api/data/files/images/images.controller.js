'use strict';

var Images = require('./images.model');
var util = require('./../files.util');

/**
 * Get a specific image file by ID.
 * @return {null} request is answered.
 */
export function getImages(req, res){
  util.getOneFileByID(Images, req, res);
}
