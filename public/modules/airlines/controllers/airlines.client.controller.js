'use strict';

// Airlines controller
angular.module('airlines').controller('AirlinesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Airlines',
	function($scope, $stateParams, $location, Authentication, Airlines) {
		$scope.authentication = Authentication;

		// Create new Airline
		$scope.create = function() {
			// Create new Airline object
			var airline = new Airlines ({
				name: this.name
			});

			// Redirect after save
			airline.$save(function(response) {
				$location.path('airlines/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Airline
		$scope.remove = function(airline) {
			if ( airline ) { 
				airline.$remove();

				for (var i in $scope.airlines) {
					if ($scope.airlines [i] === airline) {
						$scope.airlines.splice(i, 1);
					}
				}
			} else {
				$scope.airline.$remove(function() {
					$location.path('airlines');
				});
			}
		};

		// Update existing Airline
		$scope.update = function() {
			var airline = $scope.airline;

			airline.$update(function() {
				$location.path('airlines/' + airline._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Airlines
		$scope.find = function() {
			$scope.airlines = Airlines.query();
		};

		// Find existing Airline
		$scope.findOne = function() {
			$scope.airline = Airlines.get({ 
				airlineId: $stateParams.airlineId
			});
		};
	}
]);