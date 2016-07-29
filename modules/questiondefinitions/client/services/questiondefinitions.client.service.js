//Questiondefinitions service used to communicate Questiondefinitions REST endpoints
(function () {
  'use strict';

  angular
    .module('questiondefinitions')
    .factory('QuestiondefinitionsService', QuestiondefinitionsService);

  QuestiondefinitionsService.$inject = ['$resource'];

  function QuestiondefinitionsService($resource) {
    return $resource('api/questiondefinitions/:questiondefinitionId', {
      questiondefinitionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
