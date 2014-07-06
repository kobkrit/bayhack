'use strict';

var _ = require('lodash');
var Whiteboard = require('./whiteboard.model');

// Get list of whiteboards
exports.index = function(req, res) {
  Whiteboard.find(function (err, whiteboards) {
    if(err) { return handleError(res, err); }
    return res.json(200, whiteboards);
  });
};

// Get a single whiteboard
exports.show = function(req, res) {
  Whiteboard.findById(req.params.id, function (err, whiteboard) {
    if(err) { return handleError(res, err); }
    if(!whiteboard) { return res.send(404); }
    return res.json(whiteboard);
  });
};

// Creates a new whiteboard in the DB.
exports.create = function(req, res) {
  Whiteboard.create(req.body, function(err, whiteboard) {
    if(err) { return handleError(res, err); }
    return res.json(201, whiteboard);
  });
};

// Updates an existing whiteboard in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Whiteboard.findById(req.params.id, function (err, whiteboard) {
    if (err) { return handleError(err); }
    if(!whiteboard) { return res.send(404); }
    var updated = _.merge(whiteboard, req.body);
    updated.save(function (err) {
      if (err) { return handleError(err); }
      return res.json(200, whiteboard);
    });
  });
};

// Deletes a whiteboard from the DB.
exports.destroy = function(req, res) {
  Whiteboard.findById(req.params.id, function (err, whiteboard) {
    if(err) { return handleError(res, err); }
    if(!whiteboard) { return res.send(404); }
    whiteboard.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}