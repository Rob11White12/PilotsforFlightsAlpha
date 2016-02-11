'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var airlineowners = require('../../app/controllers/airlineowners.server.controller');

	// Airlineowners Routes
	app.route('/airlineowners')
		.get(airlineowners.list)
		.post(users.requiresLogin, airlineowners.create);

	app.route('/airlineowners/:airlineownerId')
		.get(airlineowners.read)
		.put(users.requiresLogin, airlineowners.hasAuthorization, airlineowners.update)
		.delete(users.requiresLogin, airlineowners.hasAuthorization, airlineowners.delete);

	// Finish by binding the Airlineowner middleware
	app.param('airlineownerId', airlineowners.airlineownerByID);
};
