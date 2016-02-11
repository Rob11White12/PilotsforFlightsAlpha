'use strict';

//Airlineowners service used to communicate Airlineowners REST endpoints
angular.module('airlineowners').factory('Airlineowners', ['$resource',
	function($resource) {
		return $resource('airlineowners/:airlineownerId', { airlineownerId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);