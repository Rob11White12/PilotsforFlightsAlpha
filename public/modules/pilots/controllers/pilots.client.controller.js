'use strict';

// Pilots controller
angular.module('pilots').controller('PilotsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Pilots',
	function($scope, $stateParams, $location, Authentication, Pilots) {
		$scope.authentication = Authentication;

		// Create new Pilot
		$scope.create = function() {
			// Create new Pilot object
			var pilot = new Pilots ({
				name: this.name
			});

			// Redirect after save
			pilot.$save(function(response) {
				$location.path('pilots/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Pilot
		$scope.remove = function(pilot) {
			if ( pilot ) { 
				pilot.$remove();

				for (var i in $scope.pilots) {
					if ($scope.pilots [i] === pilot) {
						$scope.pilots.splice(i, 1);
					}
				}
			} else {
				$scope.pilot.$remove(function() {
					$location.path('pilots');
				});
			}
		};

		// Update existing Pilot
		$scope.update = function() {
			var pilot = $scope.pilot;

			pilot.$update(function() {
				$location.path('pilots/' + pilot._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Pilots
		$scope.find = function() {
			$scope.pilots = Pilots.query();
		};

		// Find existing Pilot
		$scope.findOne = function() {
			$scope.pilot = Pilots.get({ 
				pilotId: $stateParams.pilotId
			});
		};
	}
]);