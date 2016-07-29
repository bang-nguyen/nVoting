'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'VotedefinitionsService',
  function ($scope, Authentication, VotedefinitionsService) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    $scope.find = function () {
      $scope.votedefinitions = VotedefinitionsService.query();
    };
  }  
]);
