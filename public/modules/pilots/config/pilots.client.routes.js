'use strict';

//Setting up route
angular.module('pilots').config(['$stateProvider',
	function($stateProvider) {
		// Pilots state routing
		$stateProvider.
		state('listPilots', {
			url: '/pilots',
			templateUrl: 'modules/pilots/views/list-pilots.client.view.html'
		}).
		state('createPilot', {
			url: '/pilots/create',
			templateUrl: 'modules/pilots/views/create-pilot.client.view.html'
		}).
		state('viewPilot', {
			url: '/pilots/:pilotId',
			templateUrl: 'modules/pilots/views/view-pilot.client.view.html'
		}).
		state('editPilot', {
			url: '/pilots/:pilotId/edit',
			templateUrl: 'modules/pilots/views/edit-pilot.client.view.html'
		});
	}
]);