'use strict';

(function() {
	// Stem4alls Controller Spec
	describe('Stem4alls Controller Tests', function() {
		// Initialize global variables
		var Stem4allsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Stem4alls controller.
			Stem4allsController = $controller('Stem4allsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Stem4all object fetched from XHR', inject(function(Stem4alls) {
			// Create sample Stem4all using the Stem4alls service
			var sampleStem4all = new Stem4alls({
				name: 'New Stem4all'
			});

			// Create a sample Stem4alls array that includes the new Stem4all
			var sampleStem4alls = [sampleStem4all];

			// Set GET response
			$httpBackend.expectGET('stem4alls').respond(sampleStem4alls);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.stem4alls).toEqualData(sampleStem4alls);
		}));

		it('$scope.findOne() should create an array with one Stem4all object fetched from XHR using a stem4allId URL parameter', inject(function(Stem4alls) {
			// Define a sample Stem4all object
			var sampleStem4all = new Stem4alls({
				name: 'New Stem4all'
			});

			// Set the URL parameter
			$stateParams.stem4allId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/stem4alls\/([0-9a-fA-F]{24})$/).respond(sampleStem4all);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.stem4all).toEqualData(sampleStem4all);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Stem4alls) {
			// Create a sample Stem4all object
			var sampleStem4allPostData = new Stem4alls({
				name: 'New Stem4all'
			});

			// Create a sample Stem4all response
			var sampleStem4allResponse = new Stem4alls({
				_id: '525cf20451979dea2c000001',
				name: 'New Stem4all'
			});

			// Fixture mock form input values
			scope.name = 'New Stem4all';

			// Set POST response
			$httpBackend.expectPOST('stem4alls', sampleStem4allPostData).respond(sampleStem4allResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Stem4all was created
			expect($location.path()).toBe('/stem4alls/' + sampleStem4allResponse._id);
		}));

		it('$scope.update() should update a valid Stem4all', inject(function(Stem4alls) {
			// Define a sample Stem4all put data
			var sampleStem4allPutData = new Stem4alls({
				_id: '525cf20451979dea2c000001',
				name: 'New Stem4all'
			});

			// Mock Stem4all in scope
			scope.stem4all = sampleStem4allPutData;

			// Set PUT response
			$httpBackend.expectPUT(/stem4alls\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/stem4alls/' + sampleStem4allPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid stem4allId and remove the Stem4all from the scope', inject(function(Stem4alls) {
			// Create new Stem4all object
			var sampleStem4all = new Stem4alls({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Stem4alls array and include the Stem4all
			scope.stem4alls = [sampleStem4all];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/stem4alls\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleStem4all);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.stem4alls.length).toBe(0);
		}));
	});
}());