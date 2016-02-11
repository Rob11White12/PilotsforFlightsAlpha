'use strict';

//Setting up route
angular.module('stem4alls').config(['$stateProvider',
	function($stateProvider) {
		// Stem4alls state routing
		$stateProvider.
		state('listStem4alls', {
			url: '/stem4alls',
			templateUrl: 'modules/stem4alls/views/list-stem4alls.client.view.html'
		}).
		state('createStem4all', {
			url: '/stem4alls/create',
			templateUrl: 'modules/stem4alls/views/create-stem4all.client.view.html'
		}).
		state('viewStem4all', {
			url: '/stem4alls/:stem4allId',
			templateUrl: 'modules/stem4alls/views/view-stem4all.client.view.html'
		}).
		state('editStem4all', {
			url: '/stem4alls/:stem4allId/edit',
			templateUrl: 'modules/stem4alls/views/edit-stem4all.client.view.html'
		});
	}
]);