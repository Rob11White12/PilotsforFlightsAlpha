'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Flight = mongoose.model('Flight'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, flight;

/**
 * Flight routes tests
 */
describe('Flight CRUD tests', function() {
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

		// Save a user to the test db and create new Flight
		user.save(function() {
			flight = {
				name: 'Flight Name'
			};

			done();
		});
	});

	it('should be able to save Flight instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Flight
				agent.post('/flights')
					.send(flight)
					.expect(200)
					.end(function(flightSaveErr, flightSaveRes) {
						// Handle Flight save error
						if (flightSaveErr) done(flightSaveErr);

						// Get a list of Flights
						agent.get('/flights')
							.end(function(flightsGetErr, flightsGetRes) {
								// Handle Flight save error
								if (flightsGetErr) done(flightsGetErr);

								// Get Flights list
								var flights = flightsGetRes.body;

								// Set assertions
								(flights[0].user._id).should.equal(userId);
								(flights[0].name).should.match('Flight Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Flight instance if not logged in', function(done) {
		agent.post('/flights')
			.send(flight)
			.expect(401)
			.end(function(flightSaveErr, flightSaveRes) {
				// Call the assertion callback
				done(flightSaveErr);
			});
	});

	it('should not be able to save Flight instance if no name is provided', function(done) {
		// Invalidate name field
		flight.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Flight
				agent.post('/flights')
					.send(flight)
					.expect(400)
					.end(function(flightSaveErr, flightSaveRes) {
						// Set message assertion
						(flightSaveRes.body.message).should.match('Please fill Flight name');
						
						// Handle Flight save error
						done(flightSaveErr);
					});
			});
	});

	it('should be able to update Flight instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Flight
				agent.post('/flights')
					.send(flight)
					.expect(200)
					.end(function(flightSaveErr, flightSaveRes) {
						// Handle Flight save error
						if (flightSaveErr) done(flightSaveErr);

						// Update Flight name
						flight.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Flight
						agent.put('/flights/' + flightSaveRes.body._id)
							.send(flight)
							.expect(200)
							.end(function(flightUpdateErr, flightUpdateRes) {
								// Handle Flight update error
								if (flightUpdateErr) done(flightUpdateErr);

								// Set assertions
								(flightUpdateRes.body._id).should.equal(flightSaveRes.body._id);
								(flightUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Flights if not signed in', function(done) {
		// Create new Flight model instance
		var flightObj = new Flight(flight);

		// Save the Flight
		flightObj.save(function() {
			// Request Flights
			request(app).get('/flights')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Flight if not signed in', function(done) {
		// Create new Flight model instance
		var flightObj = new Flight(flight);

		// Save the Flight
		flightObj.save(function() {
			request(app).get('/flights/' + flightObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', flight.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Flight instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Flight
				agent.post('/flights')
					.send(flight)
					.expect(200)
					.end(function(flightSaveErr, flightSaveRes) {
						// Handle Flight save error
						if (flightSaveErr) done(flightSaveErr);

						// Delete existing Flight
						agent.delete('/flights/' + flightSaveRes.body._id)
							.send(flight)
							.expect(200)
							.end(function(flightDeleteErr, flightDeleteRes) {
								// Handle Flight error error
								if (flightDeleteErr) done(flightDeleteErr);

								// Set assertions
								(flightDeleteRes.body._id).should.equal(flightSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Flight instance if not signed in', function(done) {
		// Set Flight user 
		flight.user = user;

		// Create new Flight model instance
		var flightObj = new Flight(flight);

		// Save the Flight
		flightObj.save(function() {
			// Try deleting Flight
			request(app).delete('/flights/' + flightObj._id)
			.expect(401)
			.end(function(flightDeleteErr, flightDeleteRes) {
				// Set message assertion
				(flightDeleteRes.body.message).should.match('User is not logged in');

				// Handle Flight error error
				done(flightDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Flight.remove().exec();
		done();
	});
});