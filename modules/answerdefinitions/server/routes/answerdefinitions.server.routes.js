'use strict';

/**
 * Module dependencies
 */
var answerdefinitionsPolicy = require('../policies/answerdefinitions.server.policy'),
  answerdefinitions = require('../controllers/answerdefinitions.server.controller');

module.exports = function(app) {
  // Answerdefinitions Routes
  app.route('/api/answerdefinitions').all(answerdefinitionsPolicy.isAllowed)
    .get(answerdefinitions.list)
    .post(answerdefinitions.create);

  app.route('/api/answerdefinitions/:answerdefinitionId').all(answerdefinitionsPolicy.isAllowed)
    .get(answerdefinitions.read)
    .put(answerdefinitions.update)
    .delete(answerdefinitions.delete);

  // Finish by binding the Answerdefinition middleware
  app.param('answerdefinitionId', answerdefinitions.answerdefinitionByID);
};
