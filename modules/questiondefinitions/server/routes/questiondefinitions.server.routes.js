'use strict';

/**
 * Module dependencies
 */
var questiondefinitionsPolicy = require('../policies/questiondefinitions.server.policy'),
  questiondefinitions = require('../controllers/questiondefinitions.server.controller');

module.exports = function(app) {
  // Questiondefinitions Routes
  app.route('/api/questiondefinitions').all(questiondefinitionsPolicy.isAllowed)
    .get(questiondefinitions.list)
    .post(questiondefinitions.create);

  app.route('/api/questiondefinitions/:questiondefinitionId').all(questiondefinitionsPolicy.isAllowed)
    .get(questiondefinitions.read)
    .put(questiondefinitions.update)
    .delete(questiondefinitions.delete);

  // Finish by binding the Questiondefinition middleware
  app.param('questiondefinitionId', questiondefinitions.questiondefinitionByID);
};
