(function () {
  'use strict';

  angular
    .module('answerinstances')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Answerinstances',
      state: 'answerinstances',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'answerinstances', {
      title: 'List Answerinstances',
      state: 'answerinstances.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'answerinstances', {
      title: 'Create Answerinstance',
      state: 'answerinstances.create',
      roles: ['user']
    });
  }
})();
