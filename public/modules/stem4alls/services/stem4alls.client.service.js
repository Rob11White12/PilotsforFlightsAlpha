'use strict';

//Stem4alls service used to communicate Stem4alls REST endpoints
angular.module('stem4alls').factory('Stem4alls', ['$resource',
	function($resource) {
		return $resource('stem4alls/:stem4allId', { stem4allId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);