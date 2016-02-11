'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Airlineowner = mongoose.model('Airlineowner'),
	_ = require('lodash');

/**
 * Create a Airlineowner
 */
exports.create = function(req, res) {
	var airlineowner = new Airlineowner(req.body);
	airlineowner.user = req.user;

	airlineowner.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(airlineowner);
		}
	});
};

/**
 * Show the current Airlineowner
 */
exports.read = function(req, res) {
	res.jsonp(req.airlineowner);
};

/**
 * Update a Airlineowner
 */
exports.update = function(req, res) {
	var airlineowner = req.airlineowner ;

	airlineowner = _.extend(airlineowner , req.body);

	airlineowner.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(airlineowner);
		}
	});
};

/**
 * Delete an Airlineowner
 */
exports.delete = function(req, res) {
	var airlineowner = req.airlineowner ;

	airlineowner.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(airlineowner);
		}
	});
};

/**
 * List of Airlineowners
 */
exports.list = function(req, res) { 
	Airlineowner.find().sort('-created').populate('user', 'displayName').exec(function(err, airlineowners) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(airlineowners);
		}
	});
};

/**
 * Airlineowner middleware
 */
exports.airlineownerByID = function(req, res, next, id) { 
	Airlineowner.findById(id).populate('user', 'displayName').exec(function(err, airlineowner) {
		if (err) return next(err);
		if (! airlineowner) return next(new Error('Failed to load Airlineowner ' + id));
		req.airlineowner = airlineowner ;
		next();
	});
};

/**
 * Airlineowner authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.airlineowner.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
