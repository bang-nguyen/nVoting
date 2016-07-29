'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Questiontype = mongoose.model('Questiontype'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Questiontype
 */
exports.create = function(req, res) {
  var questiontype = new Questiontype(req.body);
  questiontype.user = req.user;

  questiontype.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(questiontype);
    }
  });
};

/**
 * Show the current Questiontype
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var questiontype = req.questiontype ? req.questiontype.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  questiontype.isCurrentUserOwner = req.user && questiontype.user && questiontype.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(questiontype);
};

/**
 * Update a Questiontype
 */
exports.update = function(req, res) {
  var questiontype = req.questiontype ;

  questiontype = _.extend(questiontype , req.body);

  questiontype.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(questiontype);
    }
  });
};

/**
 * Delete an Questiontype
 */
exports.delete = function(req, res) {
  var questiontype = req.questiontype ;

  questiontype.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(questiontype);
    }
  });
};

/**
 * List of Questiontypes
 */
exports.list = function(req, res) { 
  Questiontype.find().sort('-created').populate('user', 'displayName').exec(function(err, questiontypes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(questiontypes);
    }
  });
};

/**
 * Questiontype middleware
 */
exports.questiontypeByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Questiontype is invalid'
    });
  }

  Questiontype.findById(id).populate('user', 'displayName').exec(function (err, questiontype) {
    if (err) {
      return next(err);
    } else if (!questiontype) {
      return res.status(404).send({
        message: 'No Questiontype with that identifier has been found'
      });
    }
    req.questiontype = questiontype;
    next();
  });
};
