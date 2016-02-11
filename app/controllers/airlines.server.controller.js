'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Airline = mongoose.model('Airline'),
	_ = require('lodash');

/**
 * Create a Airline
 */
exports.create = function(req, res) {
	var airline = new Airline(req.body);
	airline.user = req.user;

	airline.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(airline);
		}
	});
};

/**
 * Show the current Airline
 */
exports.read = function(req, res) {
	res.jsonp(req.airline);
};

/**
 * Update a Airline
 */
exports.update = function(req, res) {
	var airline = req.airline ;

	airline = _.extend(airline , req.body);

	airline.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(airline);
		}
	});
};

/**
 * Delete an Airline
 */
exports.delete = function(req, res) {
	var airline = req.airline ;

	airline.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(airline);
		}
	});
};

/**
 * List of Airlines
 */
exports.list = function(req, res) { 
	Airline.find().sort('-created').populate('user', 'displayName').exec(function(err, airlines) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(airlines);
		}
	});
};

/**
 * Airline middleware
 */
exports.airlineByID = function(req, res, next, id) { 
	Airline.findById(id).populate('user', 'displayName').exec(function(err, airline) {
		if (err) return next(err);
		if (! airline) return next(new Error('Failed to load Airline ' + id));
		req.airline = airline ;
		next();
	});
};

/**
 * Airline authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.airline.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
