'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ChatSchema = new Schema({
  who: String,
  message: String,
  timestamp: {type : Date, default: Date.now },
  active: Boolean
});

module.exports = mongoose.model('Chat', ChatSchema);