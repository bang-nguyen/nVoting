'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Questiondefinition = mongoose.model('Questiondefinition'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Questiondefinition
 */
exports.create = function(req, res) {
  var questiondefinition = new Questiondefinition(req.body);
  questiondefinition.user = req.user;

  questiondefinition.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(questiondefinition);
    }
  });
};

/**
 * Show the current Questiondefinition
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var questiondefinition = req.questiondefinition ? req.questiondefinition.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  questiondefinition.isCurrentUserOwner = req.user && questiondefinition.user && questiondefinition.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(questiondefinition);
};

/**
 * Update a Questiondefinition
 */
exports.update = function(req, res) {
  var questiondefinition = req.questiondefinition ;

  questiondefinition = _.extend(questiondefinition , req.body);

  questiondefinition.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(questiondefinition);
    }
  });
};

/**
 * Delete an Questiondefinition
 */
exports.delete = function(req, res) {
  var questiondefinition = req.questiondefinition ;

  questiondefinition.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(questiondefinition);
    }
  });
};

/**
 * List of Questiondefinitions
 */
exports.list = function(req, res) { 
  Questiondefinition.find().sort('-created').populate('user', 'displayName').exec(function(err, questiondefinitions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(questiondefinitions);
    }
  });
};

/**
 * Questiondefinition middleware
 */
exports.questiondefinitionByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Questiondefinition is invalid'
    });
  }

  Questiondefinition.findById(id).populate('user', 'displayName').exec(function (err, questiondefinition) {
    if (err) {
      return next(err);
    } else if (!questiondefinition) {
      return res.status(404).send({
        message: 'No Questiondefinition with that identifier has been found'
      });
    }
    req.questiondefinition = questiondefinition;
    next();
  });
};
