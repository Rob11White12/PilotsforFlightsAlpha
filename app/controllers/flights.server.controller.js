'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Flight = mongoose.model('Flight'),
	_ = require('lodash');

/**
 * Create a Flight
 */
exports.create = function(req, res) {
	var flight = new Flight(req.body);
	flight.user = req.user;

	flight.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(flight);
		}
	});
};

/**
 * Show the current Flight
 */
exports.read = function(req, res) {
	res.jsonp(req.flight);
};

/**
 * Update a Flight
 */
exports.update = function(req, res) {
	var flight = req.flight ;

	flight = _.extend(flight , req.body);

	flight.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(flight);
		}
	});
};

/**
 * Delete an Flight
 */
exports.delete = function(req, res) {
	var flight = req.flight ;

	flight.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(flight);
		}
	});
};

/**
 * List of Flights
 */
exports.list = function(req, res) { 
	Flight.find().sort('-created').populate('user', 'displayName').exec(function(err, flights) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(flights);
		}
	});
};

/**
 * Flight middleware
 */
exports.flightByID = function(req, res, next, id) { 
	Flight.findById(id).populate('user', 'displayName').exec(function(err, flight) {
		if (err) return next(err);
		if (! flight) return next(new Error('Failed to load Flight ' + id));
		req.flight = flight ;
		next();
	});
};

/**
 * Flight authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.flight.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
