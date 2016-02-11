'use strict';

(function() {
	// Pilots Controller Spec
	describe('Pilots Controller Tests', function() {
		// Initialize global variables
		var PilotsController,
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

			// Initialize the Pilots controller.
			PilotsController = $controller('PilotsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Pilot object fetched from XHR', inject(function(Pilots) {
			// Create sample Pilot using the Pilots service
			var samplePilot = new Pilots({
				name: 'New Pilot'
			});

			// Create a sample Pilots array that includes the new Pilot
			var samplePilots = [samplePilot];

			// Set GET response
			$httpBackend.expectGET('pilots').respond(samplePilots);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.pilots).toEqualData(samplePilots);
		}));

		it('$scope.findOne() should create an array with one Pilot object fetched from XHR using a pilotId URL parameter', inject(function(Pilots) {
			// Define a sample Pilot object
			var samplePilot = new Pilots({
				name: 'New Pilot'
			});

			// Set the URL parameter
			$stateParams.pilotId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/pilots\/([0-9a-fA-F]{24})$/).respond(samplePilot);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.pilot).toEqualData(samplePilot);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Pilots) {
			// Create a sample Pilot object
			var samplePilotPostData = new Pilots({
				name: 'New Pilot'
			});

			// Create a sample Pilot response
			var samplePilotResponse = new Pilots({
				_id: '525cf20451979dea2c000001',
				name: 'New Pilot'
			});

			// Fixture mock form input values
			scope.name = 'New Pilot';

			// Set POST response
			$httpBackend.expectPOST('pilots', samplePilotPostData).respond(samplePilotResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Pilot was created
			expect($location.path()).toBe('/pilots/' + samplePilotResponse._id);
		}));

		it('$scope.update() should update a valid Pilot', inject(function(Pilots) {
			// Define a sample Pilot put data
			var samplePilotPutData = new Pilots({
				_id: '525cf20451979dea2c000001',
				name: 'New Pilot'
			});

			// Mock Pilot in scope
			scope.pilot = samplePilotPutData;

			// Set PUT response
			$httpBackend.expectPUT(/pilots\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/pilots/' + samplePilotPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid pilotId and remove the Pilot from the scope', inject(function(Pilots) {
			// Create new Pilot object
			var samplePilot = new Pilots({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Pilots array and include the Pilot
			scope.pilots = [samplePilot];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/pilots\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePilot);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.pilots.length).toBe(0);
		}));
	});
}());