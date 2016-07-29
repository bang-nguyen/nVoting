(function () {
  'use strict';

  angular
    .module('votedefinitions')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('votedefinitions', {
        abstract: true,
        url: '/votedefinitions',
        template: '<ui-view/>'
      })
      .state('votedefinitions.list', {
        url: '',
        templateUrl: 'modules/votedefinitions/client/views/list-votedefinitions.client.view.html',
        controller: 'VotedefinitionsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Votedefinitions List'
        }
      })
      .state('votedefinitions.create', {
        url: '/create',
        templateUrl: 'modules/votedefinitions/client/views/form-votedefinition.client.view.html',
        controller: 'VotedefinitionsController',
        controllerAs: 'vm',
        resolve: {
          votedefinitionResolve: newVotedefinition
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Votedefinitions Create'
        }
      })
      .state('votedefinitions.edit', {
        url: '/:votedefinitionId/edit',
        templateUrl: 'modules/votedefinitions/client/views/form-votedefinition.client.view.html',
        controller: 'VotedefinitionsController',
        controllerAs: 'vm',
        resolve: {
          votedefinitionResolve: getVotedefinition
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Votedefinition {{ votedefinitionResolve.name }}'
        }
      })
      .state('votedefinitions.view', {
        url: '/:votedefinitionId',
        templateUrl: 'modules/votedefinitions/client/views/view-votedefinition.client.view.html',
        controller: 'VotedefinitionsController',
        controllerAs: 'vm',
        resolve: {
          votedefinitionResolve: getVotedefinition
        },
        data:{
          pageTitle: 'Votedefinition {{ articleResolve.name }}'
        }
      })
      .state('votedefinitions.result', {
        url: '/:votedefinitionId',
        templateUrl: 'modules/votedefinitions/client/views/result-votedefinition.client.view.html',
        controller: 'VotedefinitionsController',
        controllerAs: 'vm',
        resolve: {
          votedefinitionResolve: getVotedefinition
        },
        data:{
          pageTitle: 'Votedefinition {{ articleResolve.name }}'
        }
      });
  }

  getVotedefinition.$inject = ['$stateParams', 'VotedefinitionsService'];

  function getVotedefinition($stateParams, VotedefinitionsService) {
    return VotedefinitionsService.get({
      votedefinitionId: $stateParams.votedefinitionId
    }).$promise;
  }

  newVotedefinition.$inject = ['VotedefinitionsService'];

  function newVotedefinition(VotedefinitionsService) {
    return new VotedefinitionsService();
  }
})();
