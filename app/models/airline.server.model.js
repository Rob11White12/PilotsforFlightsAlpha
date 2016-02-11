'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Airline Schema
 */
var AirlineSchema = new Schema({
	companyName: {
		type: String,
		default: '',
		required: 'Please fill Airline name',
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
		type: Schema.ObjectId,
		ref: 'flight'
	}],
	website: String,
});

mongoose.model('Airline', AirlineSchema);