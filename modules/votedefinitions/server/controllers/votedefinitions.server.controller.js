'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Votedefinition = mongoose.model('Votedefinition'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Votedefinition
 */
exports.create = function(req, res) {
  var votedefinition = new Votedefinition(req.body);
  votedefinition.user = req.user;
  votedefinition.description = req.description;
  votedefinition.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(votedefinition);
    }
  });
};

/**
 * Show the current Votedefinition
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var votedefinition = req.votedefinition ? req.votedefinition.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  votedefinition.isCurrentUserOwner = req.user && votedefinition.user && votedefinition.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(votedefinition);
};

/**
 * Update a Votedefinition
 */
exports.update = function(req, res) {
  var votedefinition = req.votedefinition ;

  votedefinition = _.extend(votedefinition , req.body);
  votedefinition.lastModifiedBy = req.user;
  votedefinition.lastModified = new Date();
  votedefinition.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(votedefinition);
    }
  });
};

/**
 * Delete an Votedefinition
 */
exports.delete = function(req, res) {
  var votedefinition = req.votedefinition ;

  votedefinition.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(votedefinition);
    }
  });
};

/**
 * List of Votedefinitions
 */
exports.list = function(req, res) { 
  Votedefinition.find().sort('-deadline').populate('user', 'displayName').exec(function(err, votedefinitions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(votedefinitions);
    }
  });
};

/**
 * Votedefinition middleware
 */
exports.votedefinitionByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Votedefinition is invalid'
    });
  }

  Votedefinition.findById(id).populate('user', 'displayName').exec(function (err, votedefinition) {
    if (err) {
      return next(err);
    } else if (!votedefinition) {
      return res.status(404).send({
        message: 'No Votedefinition with that identifier has been found'
      });
    }
    req.votedefinition = votedefinition;
    next();
  });
};
