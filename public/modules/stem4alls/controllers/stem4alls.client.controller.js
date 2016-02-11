'use strict';

// Stem4alls controller
angular.module('stem4alls').controller('Stem4allsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Stem4alls','Upload',
	function($scope, $stateParams, $location, Authentication, Stem4alls, Update) {
		$scope.authentication = Authentication;

		// Create new Stem4all
		$scope.create = function() {
			// Create new Stem4all object
			var stem4all = new Stem4alls ({
				name: this.name
			});

			// Redirect after save
			stem4all.$save(function(response) {
				$location.path('stem4alls/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Stem4all
		$scope.remove = function(stem4all) {
			if ( stem4all ) { 
				stem4all.$remove();

				for (var i in $scope.stem4alls) {
					if ($scope.stem4alls [i] === stem4all) {
						$scope.stem4alls.splice(i, 1);
					}
				}
			} else {
				$scope.stem4all.$remove(function() {
					$location.path('stem4alls');
				});
			}
		};

		// Update existing Stem4all
		$scope.update = function() {
			var stem4all = $scope.stem4all;

			stem4all.$update(function() {
				$location.path('stem4alls/' + stem4all._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Stem4alls
		$scope.find = function() {
			$scope.stem4alls = Stem4alls.query();
		};

		// Find existing Stem4all
		$scope.findOne = function() {
			$scope.stem4all = Stem4alls.get({ 
				stem4allId: $stateParams.stem4allId
			});
		};
	}
]);