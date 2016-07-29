(function () {
  'use strict';

  angular
    .module('questiontypes')
    .controller('QuestiontypesListController', QuestiontypesListController);

  QuestiontypesListController.$inject = ['QuestiontypesService'];

  function QuestiontypesListController(QuestiontypesService) {
    var vm = this;

    vm.questiontypes = QuestiontypesService.query();
  }
})();
