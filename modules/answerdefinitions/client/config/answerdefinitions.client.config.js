(function () {
  'use strict';

  angular
    .module('answerdefinitions')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Answerdefinitions',
      state: 'answerdefinitions',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'answerdefinitions', {
      title: 'List Answerdefinitions',
      state: 'answerdefinitions.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'answerdefinitions', {
      title: 'Create Answerdefinition',
      state: 'answerdefinitions.create',
      roles: ['user']
    });
  }
})();
