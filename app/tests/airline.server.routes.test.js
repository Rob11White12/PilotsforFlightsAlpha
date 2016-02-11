'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Airline = mongoose.model('Airline'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, airline;

/**
 * Airline routes tests
 */
describe('Airline CRUD tests', function() {
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

		// Save a user to the test db and create new Airline
		user.save(function() {
			airline = {
				name: 'Airline Name'
			};

			done();
		});
	});

	it('should be able to save Airline instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Airline
				agent.post('/airlines')
					.send(airline)
					.expect(200)
					.end(function(airlineSaveErr, airlineSaveRes) {
						// Handle Airline save error
						if (airlineSaveErr) done(airlineSaveErr);

						// Get a list of Airlines
						agent.get('/airlines')
							.end(function(airlinesGetErr, airlinesGetRes) {
								// Handle Airline save error
								if (airlinesGetErr) done(airlinesGetErr);

								// Get Airlines list
								var airlines = airlinesGetRes.body;

								// Set assertions
								(airlines[0].user._id).should.equal(userId);
								(airlines[0].name).should.match('Airline Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Airline instance if not logged in', function(done) {
		agent.post('/airlines')
			.send(airline)
			.expect(401)
			.end(function(airlineSaveErr, airlineSaveRes) {
				// Call the assertion callback
				done(airlineSaveErr);
			});
	});

	it('should not be able to save Airline instance if no name is provided', function(done) {
		// Invalidate name field
		airline.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Airline
				agent.post('/airlines')
					.send(airline)
					.expect(400)
					.end(function(airlineSaveErr, airlineSaveRes) {
						// Set message assertion
						(airlineSaveRes.body.message).should.match('Please fill Airline name');
						
						// Handle Airline save error
						done(airlineSaveErr);
					});
			});
	});

	it('should be able to update Airline instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Airline
				agent.post('/airlines')
					.send(airline)
					.expect(200)
					.end(function(airlineSaveErr, airlineSaveRes) {
						// Handle Airline save error
						if (airlineSaveErr) done(airlineSaveErr);

						// Update Airline name
						airline.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Airline
						agent.put('/airlines/' + airlineSaveRes.body._id)
							.send(airline)
							.expect(200)
							.end(function(airlineUpdateErr, airlineUpdateRes) {
								// Handle Airline update error
								if (airlineUpdateErr) done(airlineUpdateErr);

								// Set assertions
								(airlineUpdateRes.body._id).should.equal(airlineSaveRes.body._id);
								(airlineUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Airlines if not signed in', function(done) {
		// Create new Airline model instance
		var airlineObj = new Airline(airline);

		// Save the Airline
		airlineObj.save(function() {
			// Request Airlines
			request(app).get('/airlines')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Airline if not signed in', function(done) {
		// Create new Airline model instance
		var airlineObj = new Airline(airline);

		// Save the Airline
		airlineObj.save(function() {
			request(app).get('/airlines/' + airlineObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', airline.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Airline instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Airline
				agent.post('/airlines')
					.send(airline)
					.expect(200)
					.end(function(airlineSaveErr, airlineSaveRes) {
						// Handle Airline save error
						if (airlineSaveErr) done(airlineSaveErr);

						// Delete existing Airline
						agent.delete('/airlines/' + airlineSaveRes.body._id)
							.send(airline)
							.expect(200)
							.end(function(airlineDeleteErr, airlineDeleteRes) {
								// Handle Airline error error
								if (airlineDeleteErr) done(airlineDeleteErr);

								// Set assertions
								(airlineDeleteRes.body._id).should.equal(airlineSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Airline instance if not signed in', function(done) {
		// Set Airline user 
		airline.user = user;

		// Create new Airline model instance
		var airlineObj = new Airline(airline);

		// Save the Airline
		airlineObj.save(function() {
			// Try deleting Airline
			request(app).delete('/airlines/' + airlineObj._id)
			.expect(401)
			.end(function(airlineDeleteErr, airlineDeleteRes) {
				// Set message assertion
				(airlineDeleteRes.body.message).should.match('User is not logged in');

				// Handle Airline error error
				done(airlineDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Airline.remove().exec();
		done();
	});
});