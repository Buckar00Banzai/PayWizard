// DEPENDENCIES
// ============

var Config = global.Config = require('./config/config.js').config;
express = require("express"),
http = require("http"),
port = (process.env.PORT || Config.listenPort),
server = module.exports = express(),
mongoose = require('mongoose'),
API = require('./API');

// DATABASE CONFIGURATION
// ======================

// Connect to Database
mongoose.connect('mongodb://' + Config.database.IP + ':' + Config.database.port + '/' + Config.database.name);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'DB connection error:'));
db.once('open', function callback() {
  console.log('Connected to ' + Config.database.name);
});

// DATABASE SCHEMAS
// ================

var base = require('./schemas/baseSchema');
var ticket = require('./schemas/ticketSchema');

// SERVER CONFIGURATION
// ====================

server.configure(function() {

  server.use(express["static"](__dirname + "/../public"));

  server.use(express.errorHandler({

    dumpExceptions: true,

    showStack: true

  }));

  server.use(express.bodyParser());

  server.use(express.cookieParser());

  server.use(express.session({
    secret: Config.sessionSecret
  }));

  server.use(server.router);

  server.use(function(req, res, next) {
    if (req.query.payer) {
      console.log(req.query);
      next();
    } else {
      next();
    }
  });

});

// API
// ===

API.api(server, base, ticket);

// Start Node.js Server
http.createServer(server).listen(port);

console.log('\n\nWelcome to Stacked!\n\nPlease go to http://localhost:' + port + ' to start using Require.js and Backbone.js\n\n');
