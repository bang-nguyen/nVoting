(function () {
  'use strict';

  describe('Answerdefinitions Route Tests', function () {
    // Initialize global variables
    var $scope,
      AnswerdefinitionsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _AnswerdefinitionsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      AnswerdefinitionsService = _AnswerdefinitionsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('answerdefinitions');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/answerdefinitions');
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
          AnswerdefinitionsController,
          mockAnswerdefinition;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('answerdefinitions.view');
          $templateCache.put('modules/answerdefinitions/client/views/view-answerdefinition.client.view.html', '');

          // create mock Answerdefinition
          mockAnswerdefinition = new AnswerdefinitionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Answerdefinition Name'
          });

          //Initialize Controller
          AnswerdefinitionsController = $controller('AnswerdefinitionsController as vm', {
            $scope: $scope,
            answerdefinitionResolve: mockAnswerdefinition
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:answerdefinitionId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.answerdefinitionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            answerdefinitionId: 1
          })).toEqual('/answerdefinitions/1');
        }));

        it('should attach an Answerdefinition to the controller scope', function () {
          expect($scope.vm.answerdefinition._id).toBe(mockAnswerdefinition._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/answerdefinitions/client/views/view-answerdefinition.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          AnswerdefinitionsController,
          mockAnswerdefinition;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('answerdefinitions.create');
          $templateCache.put('modules/answerdefinitions/client/views/form-answerdefinition.client.view.html', '');

          // create mock Answerdefinition
          mockAnswerdefinition = new AnswerdefinitionsService();

          //Initialize Controller
          AnswerdefinitionsController = $controller('AnswerdefinitionsController as vm', {
            $scope: $scope,
            answerdefinitionResolve: mockAnswerdefinition
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.answerdefinitionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/answerdefinitions/create');
        }));

        it('should attach an Answerdefinition to the controller scope', function () {
          expect($scope.vm.answerdefinition._id).toBe(mockAnswerdefinition._id);
          expect($scope.vm.answerdefinition._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/answerdefinitions/client/views/form-answerdefinition.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          AnswerdefinitionsController,
          mockAnswerdefinition;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('answerdefinitions.edit');
          $templateCache.put('modules/answerdefinitions/client/views/form-answerdefinition.client.view.html', '');

          // create mock Answerdefinition
          mockAnswerdefinition = new AnswerdefinitionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Answerdefinition Name'
          });

          //Initialize Controller
          AnswerdefinitionsController = $controller('AnswerdefinitionsController as vm', {
            $scope: $scope,
            answerdefinitionResolve: mockAnswerdefinition
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:answerdefinitionId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.answerdefinitionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            answerdefinitionId: 1
          })).toEqual('/answerdefinitions/1/edit');
        }));

        it('should attach an Answerdefinition to the controller scope', function () {
          expect($scope.vm.answerdefinition._id).toBe(mockAnswerdefinition._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/answerdefinitions/client/views/form-answerdefinition.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
