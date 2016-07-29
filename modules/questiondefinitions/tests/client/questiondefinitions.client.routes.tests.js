(function () {
  'use strict';

  describe('Questiondefinitions Route Tests', function () {
    // Initialize global variables
    var $scope,
      QuestiondefinitionsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _QuestiondefinitionsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      QuestiondefinitionsService = _QuestiondefinitionsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('questiondefinitions');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/questiondefinitions');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          QuestiondefinitionsController,
          mockQuestiondefinition;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('questiondefinitions.view');
          $templateCache.put('modules/questiondefinitions/client/views/view-questiondefinition.client.view.html', '');

          // create mock Questiondefinition
          mockQuestiondefinition = new QuestiondefinitionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Questiondefinition Name'
          });

          //Initialize Controller
          QuestiondefinitionsController = $controller('QuestiondefinitionsController as vm', {
            $scope: $scope,
            questiondefinitionResolve: mockQuestiondefinition
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:questiondefinitionId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.questiondefinitionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            questiondefinitionId: 1
          })).toEqual('/questiondefinitions/1');
        }));

        it('should attach an Questiondefinition to the controller scope', function () {
          expect($scope.vm.questiondefinition._id).toBe(mockQuestiondefinition._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/questiondefinitions/client/views/view-questiondefinition.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          QuestiondefinitionsController,
          mockQuestiondefinition;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('questiondefinitions.create');
          $templateCache.put('modules/questiondefinitions/client/views/form-questiondefinition.client.view.html', '');

          // create mock Questiondefinition
          mockQuestiondefinition = new QuestiondefinitionsService();

          //Initialize Controller
          QuestiondefinitionsController = $controller('QuestiondefinitionsController as vm', {
            $scope: $scope,
            questiondefinitionResolve: mockQuestiondefinition
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.questiondefinitionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/questiondefinitions/create');
        }));

        it('should attach an Questiondefinition to the controller scope', function () {
          expect($scope.vm.questiondefinition._id).toBe(mockQuestiondefinition._id);
          expect($scope.vm.questiondefinition._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/questiondefinitions/client/views/form-questiondefinition.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          QuestiondefinitionsController,
          mockQuestiondefinition;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('questiondefinitions.edit');
          $templateCache.put('modules/questiondefinitions/client/views/form-questiondefinition.client.view.html', '');

          // create mock Questiondefinition
          mockQuestiondefinition = new QuestiondefinitionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Questiondefinition Name'
          });

          //Initialize Controller
          QuestiondefinitionsController = $controller('QuestiondefinitionsController as vm', {
            $scope: $scope,
            questiondefinitionResolve: mockQuestiondefinition
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:questiondefinitionId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.questiondefinitionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            questiondefinitionId: 1
          })).toEqual('/questiondefinitions/1/edit');
        }));

        it('should attach an Questiondefinition to the controller scope', function () {
          expect($scope.vm.questiondefinition._id).toBe(mockQuestiondefinition._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/questiondefinitions/client/views/form-questiondefinition.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
