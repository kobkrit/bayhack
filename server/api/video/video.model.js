'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var VideoSchema = new Schema({
  name: String,
  info: String,
  file: String,
  uploadBy: String,
  price: Number,
  timestamp: {type : Date, default: Date.now },
  active: Boolean
});

module.exports = mongoose.model('Video', VideoSchema);