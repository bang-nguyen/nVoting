(function () {
  'use strict';

  angular
    .module('questiontypes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('questiontypes', {
        abstract: true,
        url: '/questiontypes',
        template: '<ui-view/>'
      })
      .state('questiontypes.list', {
        url: '',
        templateUrl: 'modules/questiontypes/client/views/list-questiontypes.client.view.html',
        controller: 'QuestiontypesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Questiontypes List'
        }
      })
      .state('questiontypes.create', {
        url: '/create',
        templateUrl: 'modules/questiontypes/client/views/form-questiontype.client.view.html',
        controller: 'QuestiontypesController',
        controllerAs: 'vm',
        resolve: {
          questiontypeResolve: newQuestiontype
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Questiontypes Create'
        }
      })
      .state('questiontypes.edit', {
        url: '/:questiontypeId/edit',
        templateUrl: 'modules/questiontypes/client/views/form-questiontype.client.view.html',
        controller: 'QuestiontypesController',
        controllerAs: 'vm',
        resolve: {
          questiontypeResolve: getQuestiontype
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Questiontype {{ questiontypeResolve.name }}'
        }
      })
      .state('questiontypes.view', {
        url: '/:questiontypeId',
        templateUrl: 'modules/questiontypes/client/views/view-questiontype.client.view.html',
        controller: 'QuestiontypesController',
        controllerAs: 'vm',
        resolve: {
          questiontypeResolve: getQuestiontype
        },
        data:{
          pageTitle: 'Questiontype {{ articleResolve.name }}'
        }
      });
  }

  getQuestiontype.$inject = ['$stateParams', 'QuestiontypesService'];

  function getQuestiontype($stateParams, QuestiontypesService) {
    return QuestiontypesService.get({
      questiontypeId: $stateParams.questiontypeId
    }).$promise;
  }

  newQuestiontype.$inject = ['QuestiontypesService'];

  function newQuestiontype(QuestiontypesService) {
    return new QuestiontypesService();
  }
})();
