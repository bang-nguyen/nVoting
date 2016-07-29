(function () {
  'use strict';

  describe('Questiontypes Route Tests', function () {
    // Initialize global variables
    var $scope,
      QuestiontypesService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _QuestiontypesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      QuestiontypesService = _QuestiontypesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('questiontypes');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/questiontypes');
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
          QuestiontypesController,
          mockQuestiontype;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('questiontypes.view');
          $templateCache.put('modules/questiontypes/client/views/view-questiontype.client.view.html', '');

          // create mock Questiontype
          mockQuestiontype = new QuestiontypesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Questiontype Name'
          });

          //Initialize Controller
          QuestiontypesController = $controller('QuestiontypesController as vm', {
            $scope: $scope,
            questiontypeResolve: mockQuestiontype
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:questiontypeId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.questiontypeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            questiontypeId: 1
          })).toEqual('/questiontypes/1');
        }));

        it('should attach an Questiontype to the controller scope', function () {
          expect($scope.vm.questiontype._id).toBe(mockQuestiontype._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/questiontypes/client/views/view-questiontype.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          QuestiontypesController,
          mockQuestiontype;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('questiontypes.create');
          $templateCache.put('modules/questiontypes/client/views/form-questiontype.client.view.html', '');

          // create mock Questiontype
          mockQuestiontype = new QuestiontypesService();

          //Initialize Controller
          QuestiontypesController = $controller('QuestiontypesController as vm', {
            $scope: $scope,
            questiontypeResolve: mockQuestiontype
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.questiontypeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/questiontypes/create');
        }));

        it('should attach an Questiontype to the controller scope', function () {
          expect($scope.vm.questiontype._id).toBe(mockQuestiontype._id);
          expect($scope.vm.questiontype._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/questiontypes/client/views/form-questiontype.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          QuestiontypesController,
          mockQuestiontype;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('questiontypes.edit');
          $templateCache.put('modules/questiontypes/client/views/form-questiontype.client.view.html', '');

          // create mock Questiontype
          mockQuestiontype = new QuestiontypesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Questiontype Name'
          });

          //Initialize Controller
          QuestiontypesController = $controller('QuestiontypesController as vm', {
            $scope: $scope,
            questiontypeResolve: mockQuestiontype
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:questiontypeId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.questiontypeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            questiontypeId: 1
          })).toEqual('/questiontypes/1/edit');
        }));

        it('should attach an Questiontype to the controller scope', function () {
          expect($scope.vm.questiontype._id).toBe(mockQuestiontype._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/questiontypes/client/views/form-questiontype.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
