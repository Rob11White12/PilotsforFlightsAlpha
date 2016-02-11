'use strict';

//Setting up route
angular.module('airlines').config(['$stateProvider',
	function($stateProvider) {
		// Airlines state routing
		$stateProvider.
		state('listAirlines', {
			url: '/airlines',
			templateUrl: 'modules/airlines/views/list-airlines.client.view.html'
		}).
		state('createAirline', {
			url: '/airlines/create',
			templateUrl: 'modules/airlines/views/create-airline.client.view.html'
		}).
		state('viewAirline', {
			url: '/airlines/:airlineId',
			templateUrl: 'modules/airlines/views/view-airline.client.view.html'
		}).
		state('editAirline', {
			url: '/airlines/:airlineId/edit',
			templateUrl: 'modules/airlines/views/edit-airline.client.view.html'
		});
	}
]);