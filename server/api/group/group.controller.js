/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/groups              ->  index
 * POST    /api/groups              ->  create
 * GET     /api/groups/:id          ->  show
 * PUT     /api/groups/:id          ->  update
 * DELETE  /api/groups/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
var Group = require('./group.model');
var User = require('./../user/user.model');

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function responseWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync()
      .spread(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}


// Gets a list of Groups
export function index(req, res) {
  Group.findAsync()
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Gets a single Group from the DB
export function show(req, res) {
  Group.findById(req.params.id)
    .populate('users', 'name _id email')
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Creates a new Group in the DB
export function create(req, res) {
  Group.createAsync(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Group in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Group.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Group in the DB
export function addSet(req, res) {
  Group.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(function(entity) {
      if(entity.permissions.indexOf(req.params.name) === -1){
        entity.permissions.push(req.params.name);
      }
      return entity.saveAsync()
        .spread(updated => {
          return updated;
        });
    })
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Group in the DB
export function removeSet(req, res) {
  Group.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(function(entity) {
      entity.permissions.splice(entity.permissions.indexOf(req.params.name),1);
      return entity.saveAsync()
        .spread(updated => {
          return updated;
        });
    })
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Group in the DB
export function addUser(req, res) {
  User.findOne({email: req.body.email}).exec(function(err, user){
    if(err || !user){ res.status(404).end();}
    else{
      Group.findById(req.params.id).exec(function(err, group){
        if(err || !group){ res.status(404).end();}
        else{
          if(group.users.indexOf(user._id) === -1){
            group.users.push(user._id);
          }
          group.save(function(err, saved){
            if(err){ res.status(500).end();}
            res.status(200).end();
          });
        }
      })
    }
  })
}

// Updates an existing Group in the DB
export function removeUser(req, res) {
  Group.findById(req.params.id).exec(function(err, group){
    if(err || !group){ res.status(404).end();}
    else{
      group.users.splice(group.users.indexOf(req.params.userId),1);
      group.save(function(err, saved){
        if(err){ res.status(500).end();}
        res.status(200).end();
      });
    }
  })
}

// Deletes a Group from the DB
export function destroy(req, res) {
  Group.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
