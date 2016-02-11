'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Pilot = mongoose.model('Pilot'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, pilot;

/**
 * Pilot routes tests
 */
describe('Pilot CRUD tests', function() {
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

		// Save a user to the test db and create new Pilot
		user.save(function() {
			pilot = {
				name: 'Pilot Name'
			};

			done();
		});
	});

	it('should be able to save Pilot instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pilot
				agent.post('/pilots')
					.send(pilot)
					.expect(200)
					.end(function(pilotSaveErr, pilotSaveRes) {
						// Handle Pilot save error
						if (pilotSaveErr) done(pilotSaveErr);

						// Get a list of Pilots
						agent.get('/pilots')
							.end(function(pilotsGetErr, pilotsGetRes) {
								// Handle Pilot save error
								if (pilotsGetErr) done(pilotsGetErr);

								// Get Pilots list
								var pilots = pilotsGetRes.body;

								// Set assertions
								(pilots[0].user._id).should.equal(userId);
								(pilots[0].name).should.match('Pilot Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Pilot instance if not logged in', function(done) {
		agent.post('/pilots')
			.send(pilot)
			.expect(401)
			.end(function(pilotSaveErr, pilotSaveRes) {
				// Call the assertion callback
				done(pilotSaveErr);
			});
	});

	it('should not be able to save Pilot instance if no name is provided', function(done) {
		// Invalidate name field
		pilot.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pilot
				agent.post('/pilots')
					.send(pilot)
					.expect(400)
					.end(function(pilotSaveErr, pilotSaveRes) {
						// Set message assertion
						(pilotSaveRes.body.message).should.match('Please fill Pilot name');
						
						// Handle Pilot save error
						done(pilotSaveErr);
					});
			});
	});

	it('should be able to update Pilot instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pilot
				agent.post('/pilots')
					.send(pilot)
					.expect(200)
					.end(function(pilotSaveErr, pilotSaveRes) {
						// Handle Pilot save error
						if (pilotSaveErr) done(pilotSaveErr);

						// Update Pilot name
						pilot.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Pilot
						agent.put('/pilots/' + pilotSaveRes.body._id)
							.send(pilot)
							.expect(200)
							.end(function(pilotUpdateErr, pilotUpdateRes) {
								// Handle Pilot update error
								if (pilotUpdateErr) done(pilotUpdateErr);

								// Set assertions
								(pilotUpdateRes.body._id).should.equal(pilotSaveRes.body._id);
								(pilotUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Pilots if not signed in', function(done) {
		// Create new Pilot model instance
		var pilotObj = new Pilot(pilot);

		// Save the Pilot
		pilotObj.save(function() {
			// Request Pilots
			request(app).get('/pilots')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Pilot if not signed in', function(done) {
		// Create new Pilot model instance
		var pilotObj = new Pilot(pilot);

		// Save the Pilot
		pilotObj.save(function() {
			request(app).get('/pilots/' + pilotObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', pilot.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Pilot instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pilot
				agent.post('/pilots')
					.send(pilot)
					.expect(200)
					.end(function(pilotSaveErr, pilotSaveRes) {
						// Handle Pilot save error
						if (pilotSaveErr) done(pilotSaveErr);

						// Delete existing Pilot
						agent.delete('/pilots/' + pilotSaveRes.body._id)
							.send(pilot)
							.expect(200)
							.end(function(pilotDeleteErr, pilotDeleteRes) {
								// Handle Pilot error error
								if (pilotDeleteErr) done(pilotDeleteErr);

								// Set assertions
								(pilotDeleteRes.body._id).should.equal(pilotSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Pilot instance if not signed in', function(done) {
		// Set Pilot user 
		pilot.user = user;

		// Create new Pilot model instance
		var pilotObj = new Pilot(pilot);

		// Save the Pilot
		pilotObj.save(function() {
			// Try deleting Pilot
			request(app).delete('/pilots/' + pilotObj._id)
			.expect(401)
			.end(function(pilotDeleteErr, pilotDeleteRes) {
				// Set message assertion
				(pilotDeleteRes.body.message).should.match('User is not logged in');

				// Handle Pilot error error
				done(pilotDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Pilot.remove().exec();
		done();
	});
});