'use strict';

/**
 * Module dependencies
 */
var answerinstancesPolicy = require('../policies/answerinstances.server.policy'),
  answerinstances = require('../controllers/answerinstances.server.controller');

module.exports = function(app) {
  // Answerinstances Routes
  app.route('/api/answerinstances').all(answerinstancesPolicy.isAllowed)
    .get(answerinstances.list)
    .post(answerinstances.create);

  app.route('/api/answerinstances/:answerinstanceId').all(answerinstancesPolicy.isAllowed)
    .get(answerinstances.read)
    .put(answerinstances.update)
    .delete(answerinstances.delete);

  // Finish by binding the Answerinstance middleware
  app.param('answerinstanceId', answerinstances.answerinstanceByID);
};
