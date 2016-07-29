'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Questiontypes Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/questiontypes',
      permissions: '*'
    }, {
      resources: '/api/questiontypes/:questiontypeId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/questiontypes',
      permissions: ['get', 'post']
    }, {
      resources: '/api/questiontypes/:questiontypeId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/questiontypes',
      permissions: ['get']
    }, {
      resources: '/api/questiontypes/:questiontypeId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Questiontypes Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Questiontype is being processed and the current user created it then allow any manipulation
  if (req.questiontype && req.user && req.questiontype.user && req.questiontype.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
