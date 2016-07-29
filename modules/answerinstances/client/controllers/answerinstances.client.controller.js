(function () {
  'use strict';

  // Answerinstances controller
  angular
    .module('answerinstances')
    .controller('AnswerinstancesController', AnswerinstancesController);

  AnswerinstancesController.$inject = ['$scope', '$state', 'Authentication', 'answerinstanceResolve'];

  function AnswerinstancesController ($scope, $state, Authentication, answerinstance) {
    var vm = this;

    vm.authentication = Authentication;
    vm.answerinstance = answerinstance;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Answerinstance
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.answerinstance.$remove($state.go('answerinstances.list'));
      }
    }

    // Save Answerinstance
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.answerinstanceForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.answerinstance._id) {
        vm.answerinstance.$update(successCallback, errorCallback);
      } else {
        vm.answerinstance.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('answerinstances.view', {
          answerinstanceId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
