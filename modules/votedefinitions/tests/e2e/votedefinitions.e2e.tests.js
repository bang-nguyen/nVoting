'use strict';

describe('Votedefinitions E2E Tests:', function () {
  describe('Test Votedefinitions page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/votedefinitions');
      expect(element.all(by.repeater('votedefinition in votedefinitions')).count()).toEqual(0);
    });
  });
});
