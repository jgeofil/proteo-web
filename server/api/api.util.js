'use strict';
var mongoose = require('bluebird').promisifyAll(require('mongoose'));
import Group from './group/group.model';


export function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

export function responseWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

export function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    console.log(err);
    res.status(statusCode).send(err);
  };
}


export function combineGroups (groups) {
  var permissions = [];
  groups.forEach(function(d){
    permissions = permissions.concat(d.permissions);
  });
  return permissions;
}

function projectIdNotFound (entity, groups){
  var id;
  if(entity.project instanceof mongoose.Types.ObjectId){
    id = entity.project
  }
  else {
    id = entity.project._id
  }
  return !groups.some(function(g){
    return g.equals(id);
  })
}

function checkIfAuthorized (entity, req) {
  return function (groups){
    if(req.user.role === 'admin'){
      return entity
    }else{
      if(Array.isArray(entity)){
        entity.forEach(function(obj){
          if(projectIdNotFound(obj, groups)){
            throw new Error('One or more entities not authorized on project.');
          }
        })
      }else{
        if(projectIdNotFound(entity, groups)){
          throw new Error('Not authorized on project.');
        }
      }
      return entity
    }
  }
}

export function userIsAuthorizedAtProjectLevel(req, res){
  return function (entity){
    return Group.find({users: mongoose.Types.ObjectId(req.user._id)})
      .then(handleEntityNotFound(res))
      .then(combineGroups)
      .then(checkIfAuthorized(entity, req))
  }
}
