'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var	errorHandler = require('./errors.server.controller');
var	Stem4all = mongoose.model('Stem4all');
var	_ = require('lodash');
var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
var gfs = new Grid(mongoose.connection.db);


/**
 * upload a file to Stem4all
 */
exports.filecreate = function(req,res){
	var part = req.files.filefield;
	 
    var writeStream = gfs.createWriteStream({
        filename: part.name,
		mode: 'w',
        content_type:part.mimetype
    });


    writeStream.on('close', function() {
         return res.status(200).send({
			message: 'Success'
		});
    });
    
    writeStream.write(part.data);

    writeStream.end();
	
};

/**
 * read a file from Stem4all
 */
exports.fileread = function(req, res){
	gfs.files.find({ filename: req.params.filename }).toArray(function (err, files) {
		 
 	    if(files.length===0){
			return res.status(400).send({
				message: 'File not found'
			});
 	    }
	
		res.writeHead(200, {'Content-Type': files[0].contentType});
		
		var readstream = gfs.createReadStream({
			  filename: files[0].filename
		});
 
	    readstream.on('data', function(data) {
	        res.write(data);
	    });
	    
	    readstream.on('end', function() {
	        res.end();        
	    });
 
		readstream.on('error', function (err) {
		  console.log('An error occurred!', err);
		  throw err;
		});
	});
};
/**
 * Create a Stem4all
 */
exports.create = function(req, res) {
	var stem4all = new Stem4all(req.body);
	stem4all.user = req.user;

	stem4all.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(stem4all);
		}
	});
};

/**
 * Show the current Stem4all
 */
exports.read = function(req, res) {
	res.jsonp(req.stem4all);
};

/**
 * Update a Stem4all
 */
exports.update = function(req, res) {
	var stem4all = req.stem4all ;

	stem4all = _.extend(stem4all , req.body);

	stem4all.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(stem4all);
		}
	});
};

/**
 * Delete an Stem4all
 */
exports.delete = function(req, res) {
	var stem4all = req.stem4all ;

	stem4all.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(stem4all);
		}
	});
};

/**
 * List of Stem4alls
 */
exports.list = function(req, res) { 
	Stem4all.find().sort('-created').populate('user', 'displayName').exec(function(err, stem4alls) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(stem4alls);
		}
	});
};

/**
 * Stem4all middleware
 */
exports.stem4allByID = function(req, res, next, id) { 
	Stem4all.findById(id).populate('user', 'displayName').exec(function(err, stem4all) {
		if (err) return next(err);
		if (! stem4all) return next(new Error('Failed to load Stem4all ' + id));
		req.stem4all = stem4all ;
		next();
	});
};

/**
 * Stem4all authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.stem4all.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
