(function () {
  'use strict';

  // Answerdefinitions controller
  angular
    .module('answerdefinitions')
    .controller('AnswerdefinitionsController', AnswerdefinitionsController);

  AnswerdefinitionsController.$inject = ['$scope', '$state', 'Authentication', 'answerdefinitionResolve'];

  function AnswerdefinitionsController ($scope, $state, Authentication, answerdefinition) {
    var vm = this;

    vm.authentication = Authentication;
    vm.answerdefinition = answerdefinition;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Answerdefinition
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.answerdefinition.$remove($state.go('answerdefinitions.list'));
      }
    }

    // Save Answerdefinition
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.answerdefinitionForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.answerdefinition._id) {
        vm.answerdefinition.$update(successCallback, errorCallback);
      } else {
        vm.answerdefinition.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('answerdefinitions.view', {
          answerdefinitionId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
