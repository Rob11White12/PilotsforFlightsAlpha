'use strict';

//Pilots service used to communicate Pilots REST endpoints
angular.module('pilots').factory('Pilots', ['$resource',
	function($resource) {
		return $resource('pilots/:pilotId', { pilotId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);