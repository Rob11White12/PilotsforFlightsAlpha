'use strict';

// Configuring the Articles module
angular.module('stem4alls').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Stem4alls', 'stem4alls', 'dropdown', '/stem4alls(/create)?');
		Menus.addSubMenuItem('topbar', 'stem4alls', 'List Stem4alls', 'stem4alls');
		Menus.addSubMenuItem('topbar', 'stem4alls', 'New Stem4all', 'stem4alls/create');
	}
]);