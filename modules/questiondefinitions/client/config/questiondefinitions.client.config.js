(function () {
  'use strict';

  angular
    .module('questiondefinitions')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Questiondefinitions',
      state: 'questiondefinitions',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'questiondefinitions', {
      title: 'List Questiondefinitions',
      state: 'questiondefinitions.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'questiondefinitions', {
      title: 'Create Questiondefinition',
      state: 'questiondefinitions.create',
      roles: ['user']
    });
  }
})();
