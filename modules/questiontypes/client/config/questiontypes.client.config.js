(function () {
  'use strict';

  angular
    .module('questiontypes')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Questiontypes',
      state: 'questiontypes',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'questiontypes', {
      title: 'List Questiontypes',
      state: 'questiontypes.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'questiontypes', {
      title: 'Create Questiontype',
      state: 'questiontypes.create',
      roles: ['user']
    });
  }
})();
