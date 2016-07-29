(function () {
  'use strict';

  angular
    .module('votedefinitions')
    .controller('VotedefinitionsListController', VotedefinitionsListController);

  VotedefinitionsListController.$inject = ['VotedefinitionsService'];

  function VotedefinitionsListController(VotedefinitionsService) {
    var vm = this;
    vm.searchStatus = '';
    vm.propertyName = 'deadline';
    vm.reverse = false;
    vm.votedefinitions = VotedefinitionsService.query();

    vm.sortBy = function (propertyName) {
      vm.reverse = (vm.propertyName === propertyName) ? !vm.reverse : false;
      vm.propertyName = propertyName;
    };
  }
})();
