(function () {
  'use strict';

  angular
    .module('questiondefinitions')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('questiondefinitions', {
        abstract: true,
        url: '/questiondefinitions',
        template: '<ui-view/>'
      })
      .state('questiondefinitions.list', {
        url: '',
        templateUrl: 'modules/questiondefinitions/client/views/list-questiondefinitions.client.view.html',
        controller: 'QuestiondefinitionsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Questiondefinitions List'
        }
      })
      .state('questiondefinitions.create', {
        url: '/create',
        templateUrl: 'modules/questiondefinitions/client/views/form-questiondefinition.client.view.html',
        controller: 'QuestiondefinitionsController',
        controllerAs: 'vm',
        resolve: {
          questiondefinitionResolve: newQuestiondefinition
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Questiondefinitions Create'
        }
      })
      .state('questiondefinitions.edit', {
        url: '/:questiondefinitionId/edit',
        templateUrl: 'modules/questiondefinitions/client/views/form-questiondefinition.client.view.html',
        controller: 'QuestiondefinitionsController',
        controllerAs: 'vm',
        resolve: {
          questiondefinitionResolve: getQuestiondefinition
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Questiondefinition {{ questiondefinitionResolve.name }}'
        }
      })
      .state('questiondefinitions.view', {
        url: '/:questiondefinitionId',
        templateUrl: 'modules/questiondefinitions/client/views/view-questiondefinition.client.view.html',
        controller: 'QuestiondefinitionsController',
        controllerAs: 'vm',
        resolve: {
          questiondefinitionResolve: getQuestiondefinition
        },
        data:{
          pageTitle: 'Questiondefinition {{ articleResolve.name }}'
        }
      });
  }

  getQuestiondefinition.$inject = ['$stateParams', 'QuestiondefinitionsService'];

  function getQuestiondefinition($stateParams, QuestiondefinitionsService) {
    return QuestiondefinitionsService.get({
      questiondefinitionId: $stateParams.questiondefinitionId
    }).$promise;
  }

  newQuestiondefinition.$inject = ['QuestiondefinitionsService'];

  function newQuestiondefinition(QuestiondefinitionsService) {
    return new QuestiondefinitionsService();
  }
})();
