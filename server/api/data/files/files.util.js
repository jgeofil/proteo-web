'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Grid = require('gridfs-stream');
var util = require('./../util');
var conn = mongoose.connection;
Grid.mongo = mongoose.mongo;
var gfs = new Grid(conn.db);

export function getOneFileByID (type, req, res){

  type.findOne({_id: req.params.fileId}, function(err, file){
    if(!err && file && util.isAuthorizedOnProject(req.user._id, file.project)){
      var readstream = gfs.createReadStream({
        _id: file.gridFile
      });
      readstream.on('error', function (err) {
        res.send(500, err);
      });
      readstream.pipe(res);

    }else{
      console.log(err)
      res.status(404).send("Not found");
    }
  });
}
