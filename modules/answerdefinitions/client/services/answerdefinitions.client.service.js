//Answerdefinitions service used to communicate Answerdefinitions REST endpoints
(function () {
  'use strict';

  angular
    .module('answerdefinitions')
    .factory('AnswerdefinitionsService', AnswerdefinitionsService);

  AnswerdefinitionsService.$inject = ['$resource'];

  function AnswerdefinitionsService($resource) {
    return $resource('api/answerdefinitions/:answerdefinitionId', {
      answerdefinitionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
