var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TiltReadingSchema = new Schema({
  device: String,
  temperature: String,
  gravity: String,
  timestamp: Date,
  sessionId: String
 });

 module.exports = mongoose.model('TiltReading', TiltReadingSchema);