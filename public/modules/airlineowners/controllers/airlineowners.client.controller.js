'use strict';

// Airlineowners controller
angular.module('airlineowners').controller('AirlineownersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Airlineowners',
	function($scope, $stateParams, $location, Authentication, Airlineowners) {
		$scope.authentication = Authentication;

		// Create new Airlineowner
		$scope.create = function() {
			// Create new Airlineowner object
			var airlineowner = new Airlineowners ({
				name: this.name
			});

			// Redirect after save
			airlineowner.$save(function(response) {
				$location.path('airlineowners/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Airlineowner
		$scope.remove = function(airlineowner) {
			if ( airlineowner ) { 
				airlineowner.$remove();

				for (var i in $scope.airlineowners) {
					if ($scope.airlineowners [i] === airlineowner) {
						$scope.airlineowners.splice(i, 1);
					}
				}
			} else {
				$scope.airlineowner.$remove(function() {
					$location.path('airlineowners');
				});
			}
		};

		// Update existing Airlineowner
		$scope.update = function() {
			var airlineowner = $scope.airlineowner;

			airlineowner.$update(function() {
				$location.path('airlineowners/' + airlineowner._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Airlineowners
		$scope.find = function() {
			$scope.airlineowners = Airlineowners.query();
		};

		// Find existing Airlineowner
		$scope.findOne = function() {
			$scope.airlineowner = Airlineowners.get({ 
				airlineownerId: $stateParams.airlineownerId
			});
		};
	}
]);