(function () {
  'use strict';

  angular
    .module('answerdefinitions')
    .controller('AnswerdefinitionsListController', AnswerdefinitionsListController);

  AnswerdefinitionsListController.$inject = ['AnswerdefinitionsService'];

  function AnswerdefinitionsListController(AnswerdefinitionsService) {
    var vm = this;

    vm.answerdefinitions = AnswerdefinitionsService.query();
  }
})();
