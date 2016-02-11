'use strict';

//Setting up route
angular.module('airlineowners').config(['$stateProvider',
	function($stateProvider) {
		// Airlineowners state routing
		$stateProvider.
		state('listAirlineowners', {
			url: '/airlineowners',
			templateUrl: 'modules/airlineowners/views/list-airlineowners.client.view.html'
		}).
		state('createAirlineowner', {
			url: '/airlineowners/create',
			templateUrl: 'modules/airlineowners/views/create-airlineowner.client.view.html'
		}).
		state('viewAirlineowner', {
			url: '/airlineowners/:airlineownerId',
			templateUrl: 'modules/airlineowners/views/view-airlineowner.client.view.html'
		}).
		state('editAirlineowner', {
			url: '/airlineowners/:airlineownerId/edit',
			templateUrl: 'modules/airlineowners/views/edit-airlineowner.client.view.html'
		});
	}
]);