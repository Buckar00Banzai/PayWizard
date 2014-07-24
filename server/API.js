// API
// ===

var paypal_sdk = require('paypal-rest-sdk');
var nodemailer = require("nodemailer");

paypal_sdk.configure({
	'host': Config.paypal.host,
	'client_id': Config.paypal.client_id,
	'client_secret': Config.paypal.client_secret
});

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP", {
	service: "Gmail",
	auth: {
		user: Config.gmail.user,
		pass: Config.gmail.pass
	}
});

module.exports.api = function(server, Base, Ticket) {

	server.post('/api/createBase',
		Base.createBase
	);

	server.get('/api/base',
		Base.getBase
	);

	server.post('/api/updateBase',
		Base.updateBase
	);

	server.post('/api/authPayment', function(req, res) {

		var payment_details = {
			"intent": "sale",
			"payer": {
				"payment_method": "credit_card",
				"funding_instruments": [{
					"credit_card": {
						"number": req.body.payment.number,
						"type": req.body.payment.type,
						"expire_month": req.body.payment.expire_month,
						"expire_year": req.body.payment.expire_year,
						"cvv2": req.body.payment.cvv2,
						"first_name": req.body.payment.first_name,
						"last_name": req.body.payment.last_name,
					}
				}]
			},
			"transactions": [{
				"amount": {
					"total": req.body.payment.subtotal,
					"currency": "USD",
					"details": {
						"subtotal": req.body.payment.subtotal,
						"fee": "0.10",
					}
				},
				"description": "New Moon in Leo Donation"
			}]
		};

		paypal_sdk.payment.create(payment_details, function(error, payment) {
			if (error) {
				console.error(error);
				res.send(400, error);
			} else {
				console.log(req.body.ticket.first_name + ' ' + req.body.ticket.last_name + ' bought a ticket!');
				res.send(200, payment);
			}
		});

	});

	server.post('/api/tickets',
		Ticket.createTicket
	);

	server.post('/api/sendEmail',
		function(req, res) {

			var ticket = req.body.ticket,
				payment = req.body.payment,
				j, ct;

			switch(ticket.job) {
				case 'dinnerPrep':
					j = 'Dinner Preparation';
					ct = '1pm';
					break;
				case 'dinnerClean':
					j = 'Dinner Clean Up';
					ct = '3pm';
					break;
				case 'brunchPrep':
					j = 'Brunch Preparation';
					ct = 'Be prepared to stay until 1pm on Sunday the 27th.';
					break;
				case 'brunchClean':
					j = 'Brunch Clean Up';
					ct = 'Be prepared to stay until 1pm on Sunday the 27th.';
					break;
				case 'altar':
					j = 'Altar';
					ct = '1pm';
					break;
				case 'templeSetup':
					j = 'Temple Setup';
					ct = '1pm';
					break;
				case 'templeBreakdown':
					j = 'Temple Breakdown';
					ct = 'Be prepared to stay until 1pm on Sunday the 27th.';
					break;
				case 'pointman':
					j = 'Point Person';
					ct = '1pm';
					break;
				case 'tea':
					j = 'Tea Preparation';
					ct = '1pm';
					break;
				case 'teaSetup':
					j = 'Tea Setup';
					ct = '3pm';
					break;
				case 'music':
					j = 'Musician';
					ct = '1pm';
					break;
				case 'musicSetup':
					j = 'Music Setup';
					ct = '1pm';
					break;
				case 'musicBreakdown':
					j = 'Music Breakdown';
					ct = 'Be prepared to stay until 1pm on Sunday the 27th.';
					break;
				case 'fire':
					j = 'Firekeeper';
					ct = '3pm';
					break;
			}

			console.log(req.body);

			var text = "Hey, this is a confirmation that your donation was accepted and a spot is being held for you at our gathering on July 26, 2014. Grab an extra blankie and an altar piece and alpaca your bags!\n\n";
				text = text + "DONATION DETAILS:\n\n";
				text = text + "Total: $" + payment.transactions[0].amount.total + '\n';
				text = text + "Card: " + payment.payer.funding_instruments[0].credit_card.type + ' ' + payment.payer.funding_instruments[0].credit_card.number + '\n';
				text = text + "State: " + payment.state + "\n\n";
				text = text + "CONTRIBUTION DETAILS: \n\n";
				text = text + "Activate: " + j + " (Call Time: " + ct + ")\n";
				text = text + "Generate: " + ticket.food.toString().replace('/,/g', ', ') + "\n\n";
				text = text + "Bring offerings of flowers, fruit, chocolate, candles, feathers, stones, sage, incense, words, laughter, songs, dances, and magic. Grandfather fire will be there to relieve you of anything you wish to leave behind along with the Old Moon.\n\n\n";
				text = text + "ADDRESS + DIRECTIONS:\n\n 20 Jennings Rd., Greenville, NY (about 2.5 hours from NYC, 45 minutes from Woodstock).\n\n From the south:\n\n I-87 N\n Take exit 21 toward RT 23/Catskill (.6 mi)\n Turn left at CR-23B (.3 mi)\n Slight right onto 23W (7.7 mi)\n Slight right at RT 32 (10.7 mi)\n Turn left at CR-405 (.2 mi)\n Turn left at Jennings rd\n\n From the North:\n\n I-87 S\n Take exit 21B for US-9W S toward Coxsackie/RT-81 (.3 mi)\n Turn left at US-9W (2.2 mi)\n Turn right at RT-81 (1.0 mi)\n Turn right at CR-26 (5.2 mi)\n Turn right at Hillcrest Rd (3.6 mi)\n Slight left at CR-38 (1.4 mi)\n Continue on CR-405 (1.2 mi)\n Turn left at Jennings Rd\n\n Bus/Train:\n\n There is a bus that leaves from Port Authority, NYC on Adirondack Trailways, it connects through Kingston, NY and you get off at Karen’s Flower Shop in Cairo, NY, the stop is called Cairo Junction. There is no regular taxi service here, but you can call Lee’s taxi (518-966-4861) and make an appointment ahead of time. It’s a 15 minute ride to the house. Also you can take Amtrak from Penn Station to Hudson, NY and take a regular taxi from there. It’s a 40 minute ride to the house.";

			var mailOptions = {
				from: "Al the Alpaca ✔ <alchemicalalpaca@gmail.com>", // sender address
				to: ticket.email, // list of receivers
				subject: "Your New Moon in Leo Confirmation", // Subject line
				text: text // plaintext body
			};

			// send mail with defined transport object
			smtpTransport.sendMail(mailOptions, function(error, response) {
				if (error) {
					console.log(error);
				} else {
					console.log("Message sent: " + response.message);
					res.send(200, {});
				}

				//smtpTransport.close(); // shut down the connection pool, no more messages
			});
		});

}
