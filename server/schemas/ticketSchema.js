// DEPENDENCIES
// ============

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	objectID = Schema.ObjectID;

// USER ACCOUNT SCHEMA
// ===================

var ticketSchema = new Schema({
	first_name: {
		type: String
	},
	last_name: {
		type: String
	},
	email: {
		type: String
	},
	job: {
		type: String
	},
	paid: {
		type: Boolean,
		default: false
	},
	room: {
		type: Boolean,
		default: false
	},
	food: {
		type: Array
	},
	timestamp: {
		type: Date,
		default: new Date()
	}
});

// CREATE DATABASE MODEL
// =====================

var ticketModel = mongoose.model('ticketModel', ticketSchema);
module.exports = ticketModel;

// SCHEMA METHODS
// ==============

module.exports.createTicket = function(req, res) {

	ticketModel.create(req.body, function(err, docs) {
		if (err) throw err;
		console.log('Ticket created for ' + req.body.first_name + ' ' + req.body.last_name);
		res.send(200, docs);
	});
}
