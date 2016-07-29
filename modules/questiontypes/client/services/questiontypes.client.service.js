//Questiontypes service used to communicate Questiontypes REST endpoints
(function () {
  'use strict';

  angular
    .module('questiontypes')
    .factory('QuestiontypesService', QuestiontypesService);

  QuestiontypesService.$inject = ['$resource'];

  function QuestiontypesService($resource) {
    return $resource('api/questiontypes/:questiontypeId', {
      questiontypeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
