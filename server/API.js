// API
// ===

module.exports.api = function(server, Base, Ticket) {

	// Sample Rest Call

	server.get('/hello', function(req, res){
		res.send('<h1>Hello World!</h1>');
	});

	server.get('/api/base',
		Base.getBase
	);

	server.post('/api/base',
		Base.updateBase
	);

	// server.post('/api/createBase',
	// 	Base.createBase
	// );

	// server.post('/api/createNewTicket',
	// 	Ticket.create
	// );

}
