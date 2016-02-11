'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Pilot = mongoose.model('Pilot'),
	_ = require('lodash');

/**
 * Create a Pilot
 */
exports.create = function(req, res) {
	var pilot = new Pilot(req.body);
	pilot.user = req.user;

	pilot.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pilot);
		}
	});
};

/**
 * Show the current Pilot
 */
exports.read = function(req, res) {
	res.jsonp(req.pilot);
};

/**
 * Update a Pilot
 */
exports.update = function(req, res) {
	var pilot = req.pilot ;

	pilot = _.extend(pilot , req.body);

	pilot.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pilot);
		}
	});
};

/**
 * Delete an Pilot
 */
exports.delete = function(req, res) {
	var pilot = req.pilot ;

	pilot.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pilot);
		}
	});
};

/**
 * List of Pilots
 */
exports.list = function(req, res) { 
	Pilot.find().sort('-created').populate('user', 'displayName').exec(function(err, pilots) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pilots);
		}
	});
};

/**
 * Pilot middleware
 */
exports.pilotByID = function(req, res, next, id) { 
	Pilot.findById(id).populate('user', 'displayName').exec(function(err, pilot) {
		if (err) return next(err);
		if (! pilot) return next(new Error('Failed to load Pilot ' + id));
		req.pilot = pilot ;
		next();
	});
};

/**
 * Pilot authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.pilot.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
