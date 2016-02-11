'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Pilot Schema
 */
var PilotSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Pilot name',
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
	email: String,
	devices:[{
		type: Schema.ObjectId,
		 ref: 'device'
	}],
	flgihts: [{
		type:Schema.ObjectId,
		 ref:'flight'
	}]
	
});

mongoose.model('Pilot', PilotSchema);