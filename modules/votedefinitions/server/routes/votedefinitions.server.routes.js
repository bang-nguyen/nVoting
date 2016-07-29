'use strict';

/**
 * Module dependencies
 */
var votedefinitionsPolicy = require('../policies/votedefinitions.server.policy'),
  votedefinitions = require('../controllers/votedefinitions.server.controller');

module.exports = function(app) {
  // Votedefinitions Routes
  app.route('/api/votedefinitions').all(votedefinitionsPolicy.isAllowed)
    .get(votedefinitions.list)
    .post(votedefinitions.create);

  app.route('/api/votedefinitions/:votedefinitionId').all(votedefinitionsPolicy.isAllowed)
    .get(votedefinitions.read)
    .put(votedefinitions.update)
    .delete(votedefinitions.delete);

  // Finish by binding the Votedefinition middleware
  app.param('votedefinitionId', votedefinitions.votedefinitionByID);
};
