'use strict';

/**
 * Module dependencies
 */
var questiontypesPolicy = require('../policies/questiontypes.server.policy'),
  questiontypes = require('../controllers/questiontypes.server.controller');

module.exports = function(app) {
  // Questiontypes Routes
  app.route('/api/questiontypes').all(questiontypesPolicy.isAllowed)
    .get(questiontypes.list)
    .post(questiontypes.create);

  app.route('/api/questiontypes/:questiontypeId').all(questiontypesPolicy.isAllowed)
    .get(questiontypes.read)
    .put(questiontypes.update)
    .delete(questiontypes.delete);

  // Finish by binding the Questiontype middleware
  app.param('questiontypeId', questiontypes.questiontypeByID);
};
