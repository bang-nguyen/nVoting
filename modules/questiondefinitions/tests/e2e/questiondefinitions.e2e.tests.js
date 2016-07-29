'use strict';

describe('Questiondefinitions E2E Tests:', function () {
  describe('Test Questiondefinitions page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/questiondefinitions');
      expect(element.all(by.repeater('questiondefinition in questiondefinitions')).count()).toEqual(0);
    });
  });
});
