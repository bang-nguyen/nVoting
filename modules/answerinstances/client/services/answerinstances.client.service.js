//Answerinstances service used to communicate Answerinstances REST endpoints
(function () {
  'use strict';

  angular
    .module('answerinstances')
    .factory('AnswerinstancesService', AnswerinstancesService);

  AnswerinstancesService.$inject = ['$resource'];

  function AnswerinstancesService($resource) {
    return $resource('api/answerinstances/:answerinstanceId', {
      answerinstanceId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
