'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Airlineowner = mongoose.model('Airlineowner'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, airlineowner;

/**
 * Airlineowner routes tests
 */
describe('Airlineowner CRUD tests', function() {
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

		// Save a user to the test db and create new Airlineowner
		user.save(function() {
			airlineowner = {
				name: 'Airlineowner Name'
			};

			done();
		});
	});

	it('should be able to save Airlineowner instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Airlineowner
				agent.post('/airlineowners')
					.send(airlineowner)
					.expect(200)
					.end(function(airlineownerSaveErr, airlineownerSaveRes) {
						// Handle Airlineowner save error
						if (airlineownerSaveErr) done(airlineownerSaveErr);

						// Get a list of Airlineowners
						agent.get('/airlineowners')
							.end(function(airlineownersGetErr, airlineownersGetRes) {
								// Handle Airlineowner save error
								if (airlineownersGetErr) done(airlineownersGetErr);

								// Get Airlineowners list
								var airlineowners = airlineownersGetRes.body;

								// Set assertions
								(airlineowners[0].user._id).should.equal(userId);
								(airlineowners[0].name).should.match('Airlineowner Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Airlineowner instance if not logged in', function(done) {
		agent.post('/airlineowners')
			.send(airlineowner)
			.expect(401)
			.end(function(airlineownerSaveErr, airlineownerSaveRes) {
				// Call the assertion callback
				done(airlineownerSaveErr);
			});
	});

	it('should not be able to save Airlineowner instance if no name is provided', function(done) {
		// Invalidate name field
		airlineowner.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Airlineowner
				agent.post('/airlineowners')
					.send(airlineowner)
					.expect(400)
					.end(function(airlineownerSaveErr, airlineownerSaveRes) {
						// Set message assertion
						(airlineownerSaveRes.body.message).should.match('Please fill Airlineowner name');
						
						// Handle Airlineowner save error
						done(airlineownerSaveErr);
					});
			});
	});

	it('should be able to update Airlineowner instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Airlineowner
				agent.post('/airlineowners')
					.send(airlineowner)
					.expect(200)
					.end(function(airlineownerSaveErr, airlineownerSaveRes) {
						// Handle Airlineowner save error
						if (airlineownerSaveErr) done(airlineownerSaveErr);

						// Update Airlineowner name
						airlineowner.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Airlineowner
						agent.put('/airlineowners/' + airlineownerSaveRes.body._id)
							.send(airlineowner)
							.expect(200)
							.end(function(airlineownerUpdateErr, airlineownerUpdateRes) {
								// Handle Airlineowner update error
								if (airlineownerUpdateErr) done(airlineownerUpdateErr);

								// Set assertions
								(airlineownerUpdateRes.body._id).should.equal(airlineownerSaveRes.body._id);
								(airlineownerUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Airlineowners if not signed in', function(done) {
		// Create new Airlineowner model instance
		var airlineownerObj = new Airlineowner(airlineowner);

		// Save the Airlineowner
		airlineownerObj.save(function() {
			// Request Airlineowners
			request(app).get('/airlineowners')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Airlineowner if not signed in', function(done) {
		// Create new Airlineowner model instance
		var airlineownerObj = new Airlineowner(airlineowner);

		// Save the Airlineowner
		airlineownerObj.save(function() {
			request(app).get('/airlineowners/' + airlineownerObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', airlineowner.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Airlineowner instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Airlineowner
				agent.post('/airlineowners')
					.send(airlineowner)
					.expect(200)
					.end(function(airlineownerSaveErr, airlineownerSaveRes) {
						// Handle Airlineowner save error
						if (airlineownerSaveErr) done(airlineownerSaveErr);

						// Delete existing Airlineowner
						agent.delete('/airlineowners/' + airlineownerSaveRes.body._id)
							.send(airlineowner)
							.expect(200)
							.end(function(airlineownerDeleteErr, airlineownerDeleteRes) {
								// Handle Airlineowner error error
								if (airlineownerDeleteErr) done(airlineownerDeleteErr);

								// Set assertions
								(airlineownerDeleteRes.body._id).should.equal(airlineownerSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Airlineowner instance if not signed in', function(done) {
		// Set Airlineowner user 
		airlineowner.user = user;

		// Create new Airlineowner model instance
		var airlineownerObj = new Airlineowner(airlineowner);

		// Save the Airlineowner
		airlineownerObj.save(function() {
			// Try deleting Airlineowner
			request(app).delete('/airlineowners/' + airlineownerObj._id)
			.expect(401)
			.end(function(airlineownerDeleteErr, airlineownerDeleteRes) {
				// Set message assertion
				(airlineownerDeleteRes.body.message).should.match('User is not logged in');

				// Handle Airlineowner error error
				done(airlineownerDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Airlineowner.remove().exec();
		done();
	});
});