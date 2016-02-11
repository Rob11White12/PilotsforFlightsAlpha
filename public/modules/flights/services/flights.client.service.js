'use strict';

//Flights service used to communicate Flights REST endpoints
angular.module('flights').factory('Flights', ['$resource',
	function($resource) {
		return $resource('flights/:flightId', { flightId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);