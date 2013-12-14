// DEPENDENCIES
// ============

var mongoose =     require('mongoose'),
    Schema =     mongoose.Schema,
    objectID =     Schema.ObjectID;

// USER ACCOUNT SCHEMA
// ===================

var ticketSchema = new Schema({
  first_name: { type: String },
  last_name: { type: String },
  email: { type: String },
  job: { type: String },
  paid: { type: Boolean, default: false },
  room: { type: Boolean, default: false },
  food: { type: Array }
});

// CREATE DATABASE MODEL
// =====================

var ticketModel = mongoose.model('schemaModel', ticketSchema);
module.exports = ticketModel;

// SCHEMA METHODS
// ==============

// module.exports.schemaGet = function(req, res) {
//   schemaModel.find({'key': 1}, function(err, docs){
//     if (err) throw err;
//     res.send(docs);
//   });
// };
