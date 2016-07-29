(function () {
  'use strict';

  describe('Answerinstances Route Tests', function () {
    // Initialize global variables
    var $scope,
      AnswerinstancesService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _AnswerinstancesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      AnswerinstancesService = _AnswerinstancesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('answerinstances');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/answerinstances');
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
          AnswerinstancesController,
          mockAnswerinstance;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('answerinstances.view');
          $templateCache.put('modules/answerinstances/client/views/view-answerinstance.client.view.html', '');

          // create mock Answerinstance
          mockAnswerinstance = new AnswerinstancesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Answerinstance Name'
          });

          //Initialize Controller
          AnswerinstancesController = $controller('AnswerinstancesController as vm', {
            $scope: $scope,
            answerinstanceResolve: mockAnswerinstance
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:answerinstanceId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.answerinstanceResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            answerinstanceId: 1
          })).toEqual('/answerinstances/1');
        }));

        it('should attach an Answerinstance to the controller scope', function () {
          expect($scope.vm.answerinstance._id).toBe(mockAnswerinstance._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/answerinstances/client/views/view-answerinstance.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          AnswerinstancesController,
          mockAnswerinstance;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('answerinstances.create');
          $templateCache.put('modules/answerinstances/client/views/form-answerinstance.client.view.html', '');

          // create mock Answerinstance
          mockAnswerinstance = new AnswerinstancesService();

          //Initialize Controller
          AnswerinstancesController = $controller('AnswerinstancesController as vm', {
            $scope: $scope,
            answerinstanceResolve: mockAnswerinstance
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.answerinstanceResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/answerinstances/create');
        }));

        it('should attach an Answerinstance to the controller scope', function () {
          expect($scope.vm.answerinstance._id).toBe(mockAnswerinstance._id);
          expect($scope.vm.answerinstance._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/answerinstances/client/views/form-answerinstance.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          AnswerinstancesController,
          mockAnswerinstance;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('answerinstances.edit');
          $templateCache.put('modules/answerinstances/client/views/form-answerinstance.client.view.html', '');

          // create mock Answerinstance
          mockAnswerinstance = new AnswerinstancesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Answerinstance Name'
          });

          //Initialize Controller
          AnswerinstancesController = $controller('AnswerinstancesController as vm', {
            $scope: $scope,
            answerinstanceResolve: mockAnswerinstance
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:answerinstanceId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.answerinstanceResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            answerinstanceId: 1
          })).toEqual('/answerinstances/1/edit');
        }));

        it('should attach an Answerinstance to the controller scope', function () {
          expect($scope.vm.answerinstance._id).toBe(mockAnswerinstance._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/answerinstances/client/views/form-answerinstance.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
