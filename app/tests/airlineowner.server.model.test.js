'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Airlineowner = mongoose.model('Airlineowner');

/**
 * Globals
 */
var user, airlineowner;

/**
 * Unit tests
 */
describe('Airlineowner Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			airlineowner = new Airlineowner({
				name: 'Airlineowner Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return airlineowner.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			airlineowner.name = '';

			return airlineowner.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Airlineowner.remove().exec();
		User.remove().exec();

		done();
	});
});