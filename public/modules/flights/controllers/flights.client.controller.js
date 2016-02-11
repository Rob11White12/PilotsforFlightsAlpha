'use strict';

// Flights controller
angular.module('flights').controller('FlightsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Flights',
	function($scope, $stateParams, $location, Authentication, Flights) {
		$scope.authentication = Authentication;

		// Create new Flight
		$scope.create = function() {
			// Create new Flight object
			var flight = new Flights ({
				name: this.name
			});

			// Redirect after save
			flight.$save(function(response) {
				$location.path('flights/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Flight
		$scope.remove = function(flight) {
			if ( flight ) { 
				flight.$remove();

				for (var i in $scope.flights) {
					if ($scope.flights [i] === flight) {
						$scope.flights.splice(i, 1);
					}
				}
			} else {
				$scope.flight.$remove(function() {
					$location.path('flights');
				});
			}
		};

		// Update existing Flight
		$scope.update = function() {
			var flight = $scope.flight;

			flight.$update(function() {
				$location.path('flights/' + flight._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Flights
		$scope.find = function() {
			$scope.flights = Flights.query();
		};

		// Find existing Flight
		$scope.findOne = function() {
			$scope.flight = Flights.get({ 
				flightId: $stateParams.flightId
			});
		};
	}
]);