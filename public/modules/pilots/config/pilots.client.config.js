'use strict';

// Configuring the Articles module
angular.module('pilots').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Pilots', 'pilots', 'dropdown', '/pilots(/create)?');
		Menus.addSubMenuItem('topbar', 'pilots', 'List Pilots', 'pilots');
		Menus.addSubMenuItem('topbar', 'pilots', 'New Pilot', 'pilots/create');
	}
]);