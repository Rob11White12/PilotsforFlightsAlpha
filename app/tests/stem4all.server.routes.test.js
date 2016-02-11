'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Stem4all = mongoose.model('Stem4all'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, stem4all;

/**
 * Stem4all routes tests
 */
describe('Stem4all CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Stem4all
		user.save(function() {
			stem4all = {
				name: 'Stem4all Name'
			};

			done();
		});
	});

	it('should be able to save Stem4all instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Stem4all
				agent.post('/stem4alls')
					.send(stem4all)
					.expect(200)
					.end(function(stem4allSaveErr, stem4allSaveRes) {
						// Handle Stem4all save error
						if (stem4allSaveErr) done(stem4allSaveErr);

						// Get a list of Stem4alls
						agent.get('/stem4alls')
							.end(function(stem4allsGetErr, stem4allsGetRes) {
								// Handle Stem4all save error
								if (stem4allsGetErr) done(stem4allsGetErr);

								// Get Stem4alls list
								var stem4alls = stem4allsGetRes.body;

								// Set assertions
								(stem4alls[0].user._id).should.equal(userId);
								(stem4alls[0].name).should.match('Stem4all Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Stem4all instance if not logged in', function(done) {
		agent.post('/stem4alls')
			.send(stem4all)
			.expect(401)
			.end(function(stem4allSaveErr, stem4allSaveRes) {
				// Call the assertion callback
				done(stem4allSaveErr);
			});
	});

	it('should not be able to save Stem4all instance if no name is provided', function(done) {
		// Invalidate name field
		stem4all.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Stem4all
				agent.post('/stem4alls')
					.send(stem4all)
					.expect(400)
					.end(function(stem4allSaveErr, stem4allSaveRes) {
						// Set message assertion
						(stem4allSaveRes.body.message).should.match('Please fill Stem4all name');
						
						// Handle Stem4all save error
						done(stem4allSaveErr);
					});
			});
	});

	it('should be able to update Stem4all instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Stem4all
				agent.post('/stem4alls')
					.send(stem4all)
					.expect(200)
					.end(function(stem4allSaveErr, stem4allSaveRes) {
						// Handle Stem4all save error
						if (stem4allSaveErr) done(stem4allSaveErr);

						// Update Stem4all name
						stem4all.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Stem4all
						agent.put('/stem4alls/' + stem4allSaveRes.body._id)
							.send(stem4all)
							.expect(200)
							.end(function(stem4allUpdateErr, stem4allUpdateRes) {
								// Handle Stem4all update error
								if (stem4allUpdateErr) done(stem4allUpdateErr);

								// Set assertions
								(stem4allUpdateRes.body._id).should.equal(stem4allSaveRes.body._id);
								(stem4allUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Stem4alls if not signed in', function(done) {
		// Create new Stem4all model instance
		var stem4allObj = new Stem4all(stem4all);

		// Save the Stem4all
		stem4allObj.save(function() {
			// Request Stem4alls
			request(app).get('/stem4alls')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Stem4all if not signed in', function(done) {
		// Create new Stem4all model instance
		var stem4allObj = new Stem4all(stem4all);

		// Save the Stem4all
		stem4allObj.save(function() {
			request(app).get('/stem4alls/' + stem4allObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', stem4all.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Stem4all instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Stem4all
				agent.post('/stem4alls')
					.send(stem4all)
					.expect(200)
					.end(function(stem4allSaveErr, stem4allSaveRes) {
						// Handle Stem4all save error
						if (stem4allSaveErr) done(stem4allSaveErr);

						// Delete existing Stem4all
						agent.delete('/stem4alls/' + stem4allSaveRes.body._id)
							.send(stem4all)
							.expect(200)
							.end(function(stem4allDeleteErr, stem4allDeleteRes) {
								// Handle Stem4all error error
								if (stem4allDeleteErr) done(stem4allDeleteErr);

								// Set assertions
								(stem4allDeleteRes.body._id).should.equal(stem4allSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Stem4all instance if not signed in', function(done) {
		// Set Stem4all user 
		stem4all.user = user;

		// Create new Stem4all model instance
		var stem4allObj = new Stem4all(stem4all);

		// Save the Stem4all
		stem4allObj.save(function() {
			// Try deleting Stem4all
			request(app).delete('/stem4alls/' + stem4allObj._id)
			.expect(401)
			.end(function(stem4allDeleteErr, stem4allDeleteRes) {
				// Set message assertion
				(stem4allDeleteRes.body.message).should.match('User is not logged in');

				// Handle Stem4all error error
				done(stem4allDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Stem4all.remove().exec();
		done();
	});
});