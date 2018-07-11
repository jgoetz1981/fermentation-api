var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var TiltReading = require('../models/TiltReading.js');
var SensorSetting = require('../models/SensorSetting.js');
var SensorSession = require('../models/Session.js')

/**
 * Gets all active Sensor Sessions
 */
router.get('/', function (req, res, next) {
  SensorSession.find(function (err, results) {
    if (err) return next(err);
    res.json(results);
  });
});

/**
 * Gets all active sensors
 */
router.get('/active', function (req, res, next) {
  SensorSetting.find({ enabled: true }, function (err, results) {
    if (err) return next(err);
    res.json(results);
  });
});

/**
 * Gets the information on a single sensor
 */
router.get('/active/:sensorName', function(req,res,next) {
  SensorSetting.findOne({ device: req.params.sensorName }, function (err, results) {
    if(err) return next(err);
    res.json(results);
  })
});
/**
 * This deletes all of the session affliiated readings associated with a particular sensor
 */
router.delete('/active/:sensorName', function (req, res, next) {
  TiltReading.deleteMany({ device: req.params.sensorName, sessionId: { $exists: false } }, function (err, results) {
    if (err) return next(err);
    SensorSetting.findOneAndUpdate({device: req.params.sensorName}, {name: ''}, {new: true}, function(err, results) {
      if(err) return next(err);
      res.json(results);
    });
  });
});

/**
 * This updates the active sensor setting to add values that will be saved when the session is archived
 */
router.post('/active/:sensorName', function (req, res, next) {
  SensorSetting.findOneAndUpdate({device: req.params.sensorName},req.body, {new: true}, function(err, results) {
    if(err) {
      return next(err);
    }
    res.json(results);
  });
});

/**
 * This will update an archived sessions data
 */
router.post('/:sessionId', function(req, res, next) {
  SensorSession.findOneAndUpdate({sessionId: req.params.sessionId}, req.body, {new: true}, function(err, results) {
    if (err) return next(err);
    res.json(results);
  });
});

/**
 * This deletes the archived session given in sessionId
 */
router.delete('/:sessionId', function (req, res, next) {
  SensorSession.deleteOne({ sessionId: req.params.sessionId }, function (err, sessionResult) {
    if (err) return next(err);
    TiltReading.deleteMany({ sessionId: req.params.sessionId }, function (err, readingResult) {
      let sessionJson
      if(sessionResult) sessionJson = JSON.stringify(sessionResult);
      let readingJson = JSON.stringify(readingResult);
      res.send(`{session: ${sessionJson}}, {readings: ${readingJson}}`);
    });
  });
});

/**
 * Archives all of the current non-archived sensor readings for the given sensor name
 */
router.post('/archive/:sensorName', function (req, res, next) {
  SensorSetting.findOne({ device: req.params.sensorName }, function (err, reading) {
    var nextArchive = reading.nextArchive;
    TiltReading.updateMany({ device: req.params.sensorName, sessionId: null },
      { sessionId: `${req.params.sensorName}-${nextArchive}` },
      function (err, result) {
        SensorSetting.update({ device: req.params.sensorName }, { nextArchive: (nextArchive + 1), name: '' }, function (err, result) {
          res.json(result);
        });
        let newSession = new SensorSession();
        newSession.sessionId = `${req.params.sensorName}-${nextArchive}`;
        newSession.name = reading.name;
        newSession.save();
      });
  });
});

router.get('/archive/:sessionId', function (req, res, next) {
  SensorSession.findOne({sessionId: req.params.sessionId }, function (err, sessionResult) {
    if(err) return next(err);
    res.json(sessionResult);
  })
});

module.exports = router;