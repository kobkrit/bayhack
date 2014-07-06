/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Whiteboard = require('./whiteboard.model');

exports.register = function(socket) {
  Whiteboard.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Whiteboard.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('whiteboard:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('whiteboard:remove', doc);
}