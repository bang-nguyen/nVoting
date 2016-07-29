(function () {
  'use strict';

  // Questiontypes controller
  angular
    .module('questiontypes')
    .controller('QuestiontypesController', QuestiontypesController);

  QuestiontypesController.$inject = ['$scope', '$state', 'Authentication', 'questiontypeResolve'];

  function QuestiontypesController ($scope, $state, Authentication, questiontype) {
    var vm = this;

    vm.authentication = Authentication;
    vm.questiontype = questiontype;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Questiontype
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.questiontype.$remove($state.go('questiontypes.list'));
      }
    }

    // Save Questiontype
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.questiontypeForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.questiontype._id) {
        vm.questiontype.$update(successCallback, errorCallback);
      } else {
        vm.questiontype.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('questiontypes.view', {
          questiontypeId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
