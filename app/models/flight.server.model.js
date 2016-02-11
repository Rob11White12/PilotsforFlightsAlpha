'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Flight Schema
 */
var FlightSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Flight name',
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
	version: {
		type: String,
		default: '',
		trim: true
	},
	description: {
		type: String,
		default: '',
		trim: true
	},
	amountofPilots: {
		type: Number
	},
	deviceRequirements: [{
		type: Schema.ObjectId,
		 ref: 'device'
	}],
	pilots:[{
		type: Schema.ObjectId,
		 ref: 'pilot'
	}],
	airline:[{
		type: Schema.ObjectId,
		 ref:'airline'
	}],
	airlineOwner: [{
		type: Schema.ObjectId,
		 ref: 'airlineowner'
	}]
});

mongoose.model('Flight', FlightSchema);