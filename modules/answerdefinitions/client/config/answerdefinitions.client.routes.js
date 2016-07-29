(function () {
  'use strict';

  angular
    .module('answerdefinitions')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('answerdefinitions', {
        abstract: true,
        url: '/answerdefinitions',
        template: '<ui-view/>'
      })
      .state('answerdefinitions.list', {
        url: '',
        templateUrl: 'modules/answerdefinitions/client/views/list-answerdefinitions.client.view.html',
        controller: 'AnswerdefinitionsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Answerdefinitions List'
        }
      })
      .state('answerdefinitions.create', {
        url: '/create',
        templateUrl: 'modules/answerdefinitions/client/views/form-answerdefinition.client.view.html',
        controller: 'AnswerdefinitionsController',
        controllerAs: 'vm',
        resolve: {
          answerdefinitionResolve: newAnswerdefinition
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Answerdefinitions Create'
        }
      })
      .state('answerdefinitions.edit', {
        url: '/:answerdefinitionId/edit',
        templateUrl: 'modules/answerdefinitions/client/views/form-answerdefinition.client.view.html',
        controller: 'AnswerdefinitionsController',
        controllerAs: 'vm',
        resolve: {
          answerdefinitionResolve: getAnswerdefinition
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Answerdefinition {{ answerdefinitionResolve.name }}'
        }
      })
      .state('answerdefinitions.view', {
        url: '/:answerdefinitionId',
        templateUrl: 'modules/answerdefinitions/client/views/view-answerdefinition.client.view.html',
        controller: 'AnswerdefinitionsController',
        controllerAs: 'vm',
        resolve: {
          answerdefinitionResolve: getAnswerdefinition
        },
        data:{
          pageTitle: 'Answerdefinition {{ articleResolve.name }}'
        }
      });
  }

  getAnswerdefinition.$inject = ['$stateParams', 'AnswerdefinitionsService'];

  function getAnswerdefinition($stateParams, AnswerdefinitionsService) {
    return AnswerdefinitionsService.get({
      answerdefinitionId: $stateParams.answerdefinitionId
    }).$promise;
  }

  newAnswerdefinition.$inject = ['AnswerdefinitionsService'];

  function newAnswerdefinition(AnswerdefinitionsService) {
    return new AnswerdefinitionsService();
  }
})();
