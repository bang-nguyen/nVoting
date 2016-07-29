(function () {
  'use strict';

  angular
    .module('questiondefinitions')
    .controller('QuestiondefinitionsListController', QuestiondefinitionsListController);

  QuestiondefinitionsListController.$inject = ['QuestiondefinitionsService'];

  function QuestiondefinitionsListController(QuestiondefinitionsService) {
    var vm = this;

    vm.questiondefinitions = QuestiondefinitionsService.query();
  }
})();
