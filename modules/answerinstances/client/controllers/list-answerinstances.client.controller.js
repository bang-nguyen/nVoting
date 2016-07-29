(function () {
  'use strict';

  angular
    .module('answerinstances')
    .controller('AnswerinstancesListController', AnswerinstancesListController);

  AnswerinstancesListController.$inject = ['AnswerinstancesService'];

  function AnswerinstancesListController(AnswerinstancesService) {
    var vm = this;

    vm.answerinstances = AnswerinstancesService.query();
  }
})();
