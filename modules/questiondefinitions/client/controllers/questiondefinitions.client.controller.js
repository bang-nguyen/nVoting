(function () {
  'use strict';

  // Questiondefinitions controller
  angular
    .module('questiondefinitions')
    .controller('QuestiondefinitionsController', QuestiondefinitionsController);

  QuestiondefinitionsController.$inject = ['$scope', '$state', 'Authentication', 'questiondefinitionResolve'];

  function QuestiondefinitionsController ($scope, $state, Authentication, questiondefinition) {
    var vm = this;

    vm.authentication = Authentication;
    vm.questiondefinition = questiondefinition;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Questiondefinition
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.questiondefinition.$remove($state.go('questiondefinitions.list'));
      }
    }

    // Save Questiondefinition
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.questiondefinitionForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.questiondefinition._id) {
        vm.questiondefinition.$update(successCallback, errorCallback);
      } else {
        vm.questiondefinition.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('questiondefinitions.view', {
          questiondefinitionId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
