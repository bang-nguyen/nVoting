'use strict';

describe('Answerinstances E2E Tests:', function () {
  describe('Test Answerinstances page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/answerinstances');
      expect(element.all(by.repeater('answerinstance in answerinstances')).count()).toEqual(0);
    });
  });
});
