'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Blogentry = mongoose.model('Blogentry'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, blogentry;

/**
 * Blogentry routes tests
 */
describe('Blogentry CRUD tests', function() {
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

		// Save a user to the test db and create new Blogentry
		user.save(function() {
			blogentry = {
				name: 'Blogentry Name'
			};

			done();
		});
	});

	it('should be able to save Blogentry instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Blogentry
				agent.post('/blogentries')
					.send(blogentry)
					.expect(200)
					.end(function(blogentrySaveErr, blogentrySaveRes) {
						// Handle Blogentry save error
						if (blogentrySaveErr) done(blogentrySaveErr);

						// Get a list of Blogentries
						agent.get('/blogentries')
							.end(function(blogentriesGetErr, blogentriesGetRes) {
								// Handle Blogentry save error
								if (blogentriesGetErr) done(blogentriesGetErr);

								// Get Blogentries list
								var blogentries = blogentriesGetRes.body;

								// Set assertions
								(blogentries[0].user._id).should.equal(userId);
								(blogentries[0].name).should.match('Blogentry Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Blogentry instance if not logged in', function(done) {
		agent.post('/blogentries')
			.send(blogentry)
			.expect(401)
			.end(function(blogentrySaveErr, blogentrySaveRes) {
				// Call the assertion callback
				done(blogentrySaveErr);
			});
	});

	it('should not be able to save Blogentry instance if no name is provided', function(done) {
		// Invalidate name field
		blogentry.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Blogentry
				agent.post('/blogentries')
					.send(blogentry)
					.expect(400)
					.end(function(blogentrySaveErr, blogentrySaveRes) {
						// Set message assertion
						(blogentrySaveRes.body.message).should.match('Please fill Blogentry name');
						
						// Handle Blogentry save error
						done(blogentrySaveErr);
					});
			});
	});

	it('should be able to update Blogentry instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Blogentry
				agent.post('/blogentries')
					.send(blogentry)
					.expect(200)
					.end(function(blogentrySaveErr, blogentrySaveRes) {
						// Handle Blogentry save error
						if (blogentrySaveErr) done(blogentrySaveErr);

						// Update Blogentry name
						blogentry.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Blogentry
						agent.put('/blogentries/' + blogentrySaveRes.body._id)
							.send(blogentry)
							.expect(200)
							.end(function(blogentryUpdateErr, blogentryUpdateRes) {
								// Handle Blogentry update error
								if (blogentryUpdateErr) done(blogentryUpdateErr);

								// Set assertions
								(blogentryUpdateRes.body._id).should.equal(blogentrySaveRes.body._id);
								(blogentryUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Blogentries if not signed in', function(done) {
		// Create new Blogentry model instance
		var blogentryObj = new Blogentry(blogentry);

		// Save the Blogentry
		blogentryObj.save(function() {
			// Request Blogentries
			request(app).get('/blogentries')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Blogentry if not signed in', function(done) {
		// Create new Blogentry model instance
		var blogentryObj = new Blogentry(blogentry);

		// Save the Blogentry
		blogentryObj.save(function() {
			request(app).get('/blogentries/' + blogentryObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', blogentry.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Blogentry instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Blogentry
				agent.post('/blogentries')
					.send(blogentry)
					.expect(200)
					.end(function(blogentrySaveErr, blogentrySaveRes) {
						// Handle Blogentry save error
						if (blogentrySaveErr) done(blogentrySaveErr);

						// Delete existing Blogentry
						agent.delete('/blogentries/' + blogentrySaveRes.body._id)
							.send(blogentry)
							.expect(200)
							.end(function(blogentryDeleteErr, blogentryDeleteRes) {
								// Handle Blogentry error error
								if (blogentryDeleteErr) done(blogentryDeleteErr);

								// Set assertions
								(blogentryDeleteRes.body._id).should.equal(blogentrySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Blogentry instance if not signed in', function(done) {
		// Set Blogentry user 
		blogentry.user = user;

		// Create new Blogentry model instance
		var blogentryObj = new Blogentry(blogentry);

		// Save the Blogentry
		blogentryObj.save(function() {
			// Try deleting Blogentry
			request(app).delete('/blogentries/' + blogentryObj._id)
			.expect(401)
			.end(function(blogentryDeleteErr, blogentryDeleteRes) {
				// Set message assertion
				(blogentryDeleteRes.body.message).should.match('User is not logged in');

				// Handle Blogentry error error
				done(blogentryDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Blogentry.remove().exec();
		done();
	});
});