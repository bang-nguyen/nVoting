(function () {
  'use strict';

  angular
    .module('votedefinitions')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Votedefinitions',
      state: 'votedefinitions',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'votedefinitions', {
      title: 'List Votedefinitions',
      state: 'votedefinitions.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'votedefinitions', {
      title: 'Create Votedefinition',
      state: 'votedefinitions.create',
      roles: ['user']
    });
  }
})();
