'use strict';

describe('Questiontypes E2E Tests:', function () {
  describe('Test Questiontypes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/questiontypes');
      expect(element.all(by.repeater('questiontype in questiontypes')).count()).toEqual(0);
    });
  });
});
