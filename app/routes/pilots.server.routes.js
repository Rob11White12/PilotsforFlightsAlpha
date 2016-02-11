'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var pilots = require('../../app/controllers/pilots.server.controller');

	// Pilots Routes
	app.route('/pilots')
		.get(pilots.list)
		.post(users.requiresLogin, pilots.create);

	app.route('/pilots/:pilotId')
		.get(pilots.read)
		.put(users.requiresLogin, pilots.hasAuthorization, pilots.update)
		.delete(users.requiresLogin, pilots.hasAuthorization, pilots.delete);

	// Finish by binding the Pilot middleware
	app.param('pilotId', pilots.pilotByID);
};
