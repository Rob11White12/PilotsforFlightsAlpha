'use strict';

//Setting up route
angular.module('flights').config(['$stateProvider',
	function($stateProvider) {
		// Flights state routing
		$stateProvider.
		state('listFlights', {
			url: '/flights',
			templateUrl: 'modules/flights/views/list-flights.client.view.html'
		}).
		state('createFlight', {
			url: '/flights/create',
			templateUrl: 'modules/flights/views/create-flight.client.view.html'
		}).
		state('viewFlight', {
			url: '/flights/:flightId',
			templateUrl: 'modules/flights/views/view-flight.client.view.html'
		}).
		state('editFlight', {
			url: '/flights/:flightId/edit',
			templateUrl: 'modules/flights/views/edit-flight.client.view.html'
		});
	}
]);