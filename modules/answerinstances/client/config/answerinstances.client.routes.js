(function () {
  'use strict';

  angular
    .module('answerinstances')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('answerinstances', {
        abstract: true,
        url: '/answerinstances',
        template: '<ui-view/>'
      })
      .state('answerinstances.list', {
        url: '',
        templateUrl: 'modules/answerinstances/client/views/list-answerinstances.client.view.html',
        controller: 'AnswerinstancesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Answerinstances List'
        }
      })
      .state('answerinstances.create', {
        url: '/create',
        templateUrl: 'modules/answerinstances/client/views/form-answerinstance.client.view.html',
        controller: 'AnswerinstancesController',
        controllerAs: 'vm',
        resolve: {
          answerinstanceResolve: newAnswerinstance
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Answerinstances Create'
        }
      })
      .state('answerinstances.edit', {
        url: '/:answerinstanceId/edit',
        templateUrl: 'modules/answerinstances/client/views/form-answerinstance.client.view.html',
        controller: 'AnswerinstancesController',
        controllerAs: 'vm',
        resolve: {
          answerinstanceResolve: getAnswerinstance
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Answerinstance {{ answerinstanceResolve.name }}'
        }
      })
      .state('answerinstances.view', {
        url: '/:answerinstanceId',
        templateUrl: 'modules/answerinstances/client/views/view-answerinstance.client.view.html',
        controller: 'AnswerinstancesController',
        controllerAs: 'vm',
        resolve: {
          answerinstanceResolve: getAnswerinstance
        },
        data:{
          pageTitle: 'Answerinstance {{ articleResolve.name }}'
        }
      });
  }

  getAnswerinstance.$inject = ['$stateParams', 'AnswerinstancesService'];

  function getAnswerinstance($stateParams, AnswerinstancesService) {
    return AnswerinstancesService.get({
      answerinstanceId: $stateParams.answerinstanceId
    }).$promise;
  }

  newAnswerinstance.$inject = ['AnswerinstancesService'];

  function newAnswerinstance(AnswerinstancesService) {
    return new AnswerinstancesService();
  }
})();
