'use strict';

describe('Answerdefinitions E2E Tests:', function () {
  describe('Test Answerdefinitions page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/answerdefinitions');
      expect(element.all(by.repeater('answerdefinition in answerdefinitions')).count()).toEqual(0);
    });
  });
});
