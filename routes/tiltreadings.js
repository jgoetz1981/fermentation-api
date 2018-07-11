var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var TiltReading = require('../models/TiltReading.js');
var SensorSetting = require('../models/SensorSetting.js');
var SensorSession = require('../models/Session.js');

/**
 * Gets all readings
 */
router.get('/', function(req, res, next) {
    TiltReading.find(function(err, readings) {
        if (err) return next(err);
        res.json(readings);
    });
});

/**
 * gets all readings for a given sensor
 */
router.get('/:sensorName', function(req, res, next) {
    TiltReading.find({ device: req.params.sensorName, sessionId: {$exists: false} }, function(err, readings) {
        if (err) return next(err);
        res.json(readings);
    })
});

/**
 * Gets all of the readings that are associated with the archived sessionid
 */
router.get('/archive/:sessionId', function (req, res, next) {
  console.log('trying to read session: ' + req.params.sessionId);
  TiltReading.find({sessionId: req.params.sessionId}, function(err, readingResult) {
    if(err) return next(err);
    res.json(readingResult);
  });
});

module.exports = router;