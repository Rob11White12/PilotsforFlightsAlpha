'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Airlineowner Schema
 */
var AirlineownerSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Airlineowner name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	flights: [{
		type : Schema.ObjectId,
		ref: 'flight'
	}],
	airline: {
		type: Schema.ObjectId,
		ref: 'airline'
	}
});

mongoose.model('Airlineowner', AirlineownerSchema);