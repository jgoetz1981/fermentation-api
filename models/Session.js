var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SessionSchema = new Schema({
  sessionId: String,
  name: String
});

module.exports = mongoose.model('SensorSession', SessionSchema);