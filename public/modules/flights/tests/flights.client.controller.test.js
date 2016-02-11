'use strict';

(function() {
	// Flights Controller Spec
	describe('Flights Controller Tests', function() {
		// Initialize global variables
		var FlightsController,
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

			// Initialize the Flights controller.
			FlightsController = $controller('FlightsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Flight object fetched from XHR', inject(function(Flights) {
			// Create sample Flight using the Flights service
			var sampleFlight = new Flights({
				name: 'New Flight'
			});

			// Create a sample Flights array that includes the new Flight
			var sampleFlights = [sampleFlight];

			// Set GET response
			$httpBackend.expectGET('flights').respond(sampleFlights);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.flights).toEqualData(sampleFlights);
		}));

		it('$scope.findOne() should create an array with one Flight object fetched from XHR using a flightId URL parameter', inject(function(Flights) {
			// Define a sample Flight object
			var sampleFlight = new Flights({
				name: 'New Flight'
			});

			// Set the URL parameter
			$stateParams.flightId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/flights\/([0-9a-fA-F]{24})$/).respond(sampleFlight);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.flight).toEqualData(sampleFlight);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Flights) {
			// Create a sample Flight object
			var sampleFlightPostData = new Flights({
				name: 'New Flight'
			});

			// Create a sample Flight response
			var sampleFlightResponse = new Flights({
				_id: '525cf20451979dea2c000001',
				name: 'New Flight'
			});

			// Fixture mock form input values
			scope.name = 'New Flight';

			// Set POST response
			$httpBackend.expectPOST('flights', sampleFlightPostData).respond(sampleFlightResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Flight was created
			expect($location.path()).toBe('/flights/' + sampleFlightResponse._id);
		}));

		it('$scope.update() should update a valid Flight', inject(function(Flights) {
			// Define a sample Flight put data
			var sampleFlightPutData = new Flights({
				_id: '525cf20451979dea2c000001',
				name: 'New Flight'
			});

			// Mock Flight in scope
			scope.flight = sampleFlightPutData;

			// Set PUT response
			$httpBackend.expectPUT(/flights\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/flights/' + sampleFlightPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid flightId and remove the Flight from the scope', inject(function(Flights) {
			// Create new Flight object
			var sampleFlight = new Flights({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Flights array and include the Flight
			scope.flights = [sampleFlight];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/flights\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleFlight);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.flights.length).toBe(0);
		}));
	});
}());