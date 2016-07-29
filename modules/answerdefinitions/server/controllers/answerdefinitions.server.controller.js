'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Answerdefinition = mongoose.model('Answerdefinition'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Answerdefinition
 */
exports.create = function(req, res) {
  var answerdefinition = new Answerdefinition(req.body);
  answerdefinition.user = req.user;

  answerdefinition.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(answerdefinition);
    }
  });
};

/**
 * Show the current Answerdefinition
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var answerdefinition = req.answerdefinition ? req.answerdefinition.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  answerdefinition.isCurrentUserOwner = req.user && answerdefinition.user && answerdefinition.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(answerdefinition);
};

/**
 * Update a Answerdefinition
 */
exports.update = function(req, res) {
  var answerdefinition = req.answerdefinition ;

  answerdefinition = _.extend(answerdefinition , req.body);

  answerdefinition.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(answerdefinition);
    }
  });
};

/**
 * Delete an Answerdefinition
 */
exports.delete = function(req, res) {
  var answerdefinition = req.answerdefinition ;

  answerdefinition.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(answerdefinition);
    }
  });
};

/**
 * List of Answerdefinitions
 */
exports.list = function(req, res) { 
  Answerdefinition.find().sort('-created').populate('user', 'displayName').exec(function(err, answerdefinitions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(answerdefinitions);
    }
  });
};

/**
 * Answerdefinition middleware
 */
exports.answerdefinitionByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Answerdefinition is invalid'
    });
  }

  Answerdefinition.findById(id).populate('user', 'displayName').exec(function (err, answerdefinition) {
    if (err) {
      return next(err);
    } else if (!answerdefinition) {
      return res.status(404).send({
        message: 'No Answerdefinition with that identifier has been found'
      });
    }
    req.answerdefinition = answerdefinition;
    next();
  });
};
