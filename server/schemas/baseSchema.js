// DEPENDENCIES
// ============

var mongoose =     require('mongoose'),
    Schema =     mongoose.Schema,
    objectID =     Schema.ObjectID;

// USER ACCOUNT SCHEMA
// ===================

var baseSchema = new Schema({
  // GLOBALS
  key: {type: Number, default: 0},
  tickets: {type: Number, default: 50},
  beds: {type: Number, default: 12},

  //JOBS
  dinnerPrep: {type: Number, default: 3},
  dinnerClean: {type: Number, default: 3},
  brunchPrep: {type: Number, default: 3},
  brunchClean: {type: Number, default: 3},
  alter: {type: Number, default: 3},
  templeSetup: {type: Number, default: 4},
  templeBreakdown: {type: Number, default: 4},
  tea: {type: Number, default: 3},
  teaSetup: {type: Number, default: 3},
  music: {type: Number, default: 6},
  musicSetup: {type: Number, default: 2},
  fire: {type: Number, default: 2}
});

// CREATE DATABASE MODEL
// =====================

var baseModel = mongoose.model('baseModel', baseSchema);
module.exports = baseModel;

// SCHEMA METHODS
// ==============

module.exports.getBase = function(req, res) {
  baseModel.findOne({key: 0}, function(err, docs){
    if (err) throw err;
    res.send(docs);
  });
};

module.exports.createBase = function(req, res) {
  baseModel.create({key: 0}, function(err, docs){
    if(err) throw err;
    res.send(docs);
  })
}

module.exports.updateBase = function(req, res) {
  baseModel.update({'key': 0}, function(err, docs){
    if(err) throw err;
    res.send(docs);
  });
}
