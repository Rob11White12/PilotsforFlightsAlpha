'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var airlines = require('../../app/controllers/airlines.server.controller');

	// Airlines Routes
	app.route('/airlines')
		.get(airlines.list)
		.post(users.requiresLogin, airlines.create);

	app.route('/airlines/:airlineId')
		.get(airlines.read)
		.put(users.requiresLogin, airlines.hasAuthorization, airlines.update)
		.delete(users.requiresLogin, airlines.hasAuthorization, airlines.delete);

	// Finish by binding the Airline middleware
	app.param('airlineId', airlines.airlineByID);
};
