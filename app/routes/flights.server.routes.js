'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var flights = require('../../app/controllers/flights.server.controller');

	// Flights Routes
	app.route('/flights')
		.get(flights.list)
		.post(users.requiresLogin, flights.create);

	app.route('/flights/:flightId')
		.get(flights.read)
		.put(users.requiresLogin, flights.hasAuthorization, flights.update)
		.delete(users.requiresLogin, flights.hasAuthorization, flights.delete);

	// Finish by binding the Flight middleware
	app.param('flightId', flights.flightByID);
};
