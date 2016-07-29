'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Answerinstance = mongoose.model('Answerinstance'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Answerinstance
 */
exports.create = function(req, res) {
  var answerinstance = new Answerinstance(req.body);
  answerinstance.user = req.user;

  answerinstance.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(answerinstance);
    }
  });
};

/**
 * Show the current Answerinstance
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var answerinstance = req.answerinstance ? req.answerinstance.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  answerinstance.isCurrentUserOwner = req.user && answerinstance.user && answerinstance.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(answerinstance);
};

/**
 * Update a Answerinstance
 */
exports.update = function(req, res) {
  var answerinstance = req.answerinstance ;

  answerinstance = _.extend(answerinstance , req.body);

  answerinstance.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(answerinstance);
    }
  });
};

/**
 * Delete an Answerinstance
 */
exports.delete = function(req, res) {
  var answerinstance = req.answerinstance ;

  answerinstance.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(answerinstance);
    }
  });
};

/**
 * List of Answerinstances
 */
exports.list = function(req, res) { 
  Answerinstance.find().sort('-created').populate('user', 'displayName').exec(function(err, answerinstances) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(answerinstances);
    }
  });
};

/**
 * Answerinstance middleware
 */
exports.answerinstanceByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Answerinstance is invalid'
    });
  }

  Answerinstance.findById(id).populate('user', 'displayName').exec(function (err, answerinstance) {
    if (err) {
      return next(err);
    } else if (!answerinstance) {
      return res.status(404).send({
        message: 'No Answerinstance with that identifier has been found'
      });
    }
    req.answerinstance = answerinstance;
    next();
  });
};
