//Votedefinitions service used to communicate Votedefinitions REST endpoints
(function () {
  'use strict';

  angular
    .module('votedefinitions')
    .factory('VotedefinitionsService', VotedefinitionsService);

  VotedefinitionsService.$inject = ['$resource'];

  function VotedefinitionsService($resource) {
    return $resource('api/votedefinitions/:votedefinitionId', {
      votedefinitionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
