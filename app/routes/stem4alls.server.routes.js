'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var stem4alls = require('../../app/controllers/stem4alls.server.controller');

	// Stem4alls Routes
	app.route('/stem4alls')
		.get(stem4alls.list, stem4alls.fileread)
		.post(users.requiresLogin, stem4alls.create);
	
	app.route('/stem4alls/:stem4allId')
		.get(stem4alls.read, stem4alls.fileread)
		.post(users.requiresLogin, stem4alls.hasAuthorization, stem4alls.filecreate)
		.put(users.requiresLogin, stem4alls.hasAuthorization, stem4alls.update, stem4alls.filecreate)
		.delete(users.requiresLogin, stem4alls.hasAuthorization, stem4alls.delete);

	// Finish by binding the Stem4all middleware
	app.param('stem4allId', stem4alls.stem4allByID);
};
