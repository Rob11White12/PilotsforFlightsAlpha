'use strict';

(function() {
	// Airlineowners Controller Spec
	describe('Airlineowners Controller Tests', function() {
		// Initialize global variables
		var AirlineownersController,
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

			// Initialize the Airlineowners controller.
			AirlineownersController = $controller('AirlineownersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Airlineowner object fetched from XHR', inject(function(Airlineowners) {
			// Create sample Airlineowner using the Airlineowners service
			var sampleAirlineowner = new Airlineowners({
				name: 'New Airlineowner'
			});

			// Create a sample Airlineowners array that includes the new Airlineowner
			var sampleAirlineowners = [sampleAirlineowner];

			// Set GET response
			$httpBackend.expectGET('airlineowners').respond(sampleAirlineowners);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.airlineowners).toEqualData(sampleAirlineowners);
		}));

		it('$scope.findOne() should create an array with one Airlineowner object fetched from XHR using a airlineownerId URL parameter', inject(function(Airlineowners) {
			// Define a sample Airlineowner object
			var sampleAirlineowner = new Airlineowners({
				name: 'New Airlineowner'
			});

			// Set the URL parameter
			$stateParams.airlineownerId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/airlineowners\/([0-9a-fA-F]{24})$/).respond(sampleAirlineowner);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.airlineowner).toEqualData(sampleAirlineowner);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Airlineowners) {
			// Create a sample Airlineowner object
			var sampleAirlineownerPostData = new Airlineowners({
				name: 'New Airlineowner'
			});

			// Create a sample Airlineowner response
			var sampleAirlineownerResponse = new Airlineowners({
				_id: '525cf20451979dea2c000001',
				name: 'New Airlineowner'
			});

			// Fixture mock form input values
			scope.name = 'New Airlineowner';

			// Set POST response
			$httpBackend.expectPOST('airlineowners', sampleAirlineownerPostData).respond(sampleAirlineownerResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Airlineowner was created
			expect($location.path()).toBe('/airlineowners/' + sampleAirlineownerResponse._id);
		}));

		it('$scope.update() should update a valid Airlineowner', inject(function(Airlineowners) {
			// Define a sample Airlineowner put data
			var sampleAirlineownerPutData = new Airlineowners({
				_id: '525cf20451979dea2c000001',
				name: 'New Airlineowner'
			});

			// Mock Airlineowner in scope
			scope.airlineowner = sampleAirlineownerPutData;

			// Set PUT response
			$httpBackend.expectPUT(/airlineowners\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/airlineowners/' + sampleAirlineownerPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid airlineownerId and remove the Airlineowner from the scope', inject(function(Airlineowners) {
			// Create new Airlineowner object
			var sampleAirlineowner = new Airlineowners({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Airlineowners array and include the Airlineowner
			scope.airlineowners = [sampleAirlineowner];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/airlineowners\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleAirlineowner);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.airlineowners.length).toBe(0);
		}));
	});
}());