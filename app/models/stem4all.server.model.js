'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Stem4all Schema
 */
var Stem4allSchema = new Schema({
	title: {
		type: String,
		default: '',
		required: 'Please fill Blogentry name',
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
	body: {
		type: String,
		default: ''
	},
	comments: [{
	        text: String,
	        postedBy: {
	            type: mongoose.Schema.Types.ObjectId,
	            ref: 'User'
	        }
	    }]
});

mongoose.model('Stem4all', Stem4allSchema);