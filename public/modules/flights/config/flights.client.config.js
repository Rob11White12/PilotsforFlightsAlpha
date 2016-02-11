'use strict';

// Configuring the Articles module
angular.module('flights').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Flights', 'flights', 'dropdown', '/flights(/create)?');
		Menus.addSubMenuItem('topbar', 'flights', 'List Flights', 'flights');
		Menus.addSubMenuItem('topbar', 'flights', 'New Flight', 'flights/create');
	}
]);