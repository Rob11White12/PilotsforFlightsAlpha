'use strict';

//Airlines service used to communicate Airlines REST endpoints
angular.module('airlines').factory('Airlines', ['$resource',
	function($resource) {
		return $resource('airlines/:airlineId', { airlineId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);