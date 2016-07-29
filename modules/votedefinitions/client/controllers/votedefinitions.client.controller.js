(function () {
  'use strict';

  // Votedefinitions controller
  angular
    .module('votedefinitions')
    .controller('VotedefinitionsController', VotedefinitionsController);

  VotedefinitionsController.$inject = ['$scope', '$state', 'Authentication', 'votedefinitionResolve'];

  function VotedefinitionsController ($scope, $state, Authentication, votedefinition) {
    var vm = this;

    vm.authentication = Authentication;
    vm.votedefinition = votedefinition;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Votedefinition
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.votedefinition.$remove($state.go('votedefinitions.list'));
      }
    }

    // Save Votedefinition
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.votedefinitionForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.votedefinition._id) {
        vm.votedefinition.$update(successCallback, errorCallback);
      } else {
        vm.votedefinition.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('votedefinitions.view', {
          votedefinitionId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
