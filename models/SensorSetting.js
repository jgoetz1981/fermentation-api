var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SensorSettingsSchema = new Schema({
  device: String,
  enabled: Boolean,
  nextArchive: Number,
  name: String
});

module.exports = mongoose.model('SensorSetting', SensorSettingsSchema);
