(function () {
  'use strict';

  angular
    .module('votedefinitions')
    .controller('VotedefinitionsListController', VotedefinitionsListController);

  VotedefinitionsListController.$inject = ['VotedefinitionsService'];

  function VotedefinitionsListController(VotedefinitionsService) {
    var vm = this;

    vm.votedefinitions = VotedefinitionsService.query();
  }
})();
