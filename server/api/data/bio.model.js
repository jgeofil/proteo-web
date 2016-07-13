'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var allowedAminos = ['A','R','N','D','C','Q','E','G','H','I','L','K','M','F',
                    'P','S','T','W','Y','V'];

function validateAmino (val){
  var _val = String(val).toUpperCase();
  if (_val.length > 1) {
    throw new Error('Amino: ' + val + ' is too long.');
  }
  if (allowedAminos.indexOf(_val) === -1){
    throw new Error('Amino: ' + val + ' is not allowed.');
  }
  return _val;
}

function Amino(key, options) {
  mongoose.SchemaType.call(this, key, options, 'Amino');
}

Amino.prototype = Object.create(mongoose.SchemaType.prototype);

Amino.prototype.cast = function(val) {
  return validateAmino(val);
};

mongoose.Schema.Types.Amino = Amino;

export default {
  Amino: Amino
}
