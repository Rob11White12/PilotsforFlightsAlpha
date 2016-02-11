'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Device Schema
 */
var DeviceSchema = new Schema({
	deviceType: {
		type: String,
		default: '',
		required: 'Please fill Device name',
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
	pilots: [{
		type: Schema.ObjectId,
		ref: 'pilot'
	}]
});

mongoose.model('Device', DeviceSchema);