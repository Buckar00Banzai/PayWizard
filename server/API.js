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
						"type": req.body.payment.type,
						"number": req.body.payment.number,
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
					"total": "75.10",
					"currency": "USD",
					"details": {
						"subtotal": "75.10",
						"fee": "00.10"
					}
				},
				"description": "NYE Donation"
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
				case dinnerPrep:
					j = 'Dinner Preparation';
					ct = '2pm';
					break;
				case dinnerClean:
					j = 'Dinner Cleanup';
					ct = '4pm';
					break;
				case brunchPrep:
					j = 'Brunch Preparation';
					ct = 'Be prepaired to stay until 2pm on the 1st.';
					break;
				case brunchClean:
					j = 'Brunch Cleanup';
					ct = 'Be prepaired to stay until 2pm on the 1st.';
					break;
				case altar:
					j = 'Altar';
					ct = '2pm';
					break;
				case templeSetup:
					j = 'Temple Setup';
					ct = '2pm';
					break;
				case templeBreakdown:
					j = 'Temple Breakdown';
					ct = 'Be prepaired to stay until 2pm on the 1st.';
					break;
				case pointman:
					j = 'Point Person';
					ct = '2pm';
					break;
				case tea:
					j = 'Tea Preparation';
					ct = '2pm';
					break;
				case teaSetup:
					j = 'Tea Setup';
					ct = '4pm';
					break;
				case music:
					j = 'Musician';
					ct = '2pm';
					break;
				case musicSetup:
					j = 'Music Setup';
					ct = '2pm';
					break;
				case musicBreakdown:
					j = 'Music Breakdown';
					ct = 'Be prepaired to stay until 2pm on the 1st.';
					break;
				case fire:
					j = 'Firekeeper';
					ct = '4pm';
					break;
			}

			console.log(req.body);

			var text = "Hey, this is a confirmation that your donation was accepted and a spot is being held for you at our gathering on New Year's Eve. Grab an extra blankie and an altar piece and alpaca your bags!\n\n";
				text = text + "DONATION DETAILS:\n\n";
				text = text + "Total: $" + payment.transactions[0].amount.total + '\n';
				text = text + "Card: " + payment.payer.funding_instruments[0].credit_card.type + ' ' + payment.payer.funding_instruments[0].credit_card.number + '\n';
				text = text + "State: " + payment.state + "\n\n";
				text = text + "CONTRIBUTION DETAILS: \n\n";
				text = text + "Activate: " + j + " (Call Time: " + ct + ")\n";
				text = text + "Generate: " + ticket.food.toString().replace('/,/g', ', ') + "\n\n";
				text = text + "Bring offerings of flowers, fruit, chocolate, candles, feathers, stones, sage, incense, words, laughter, songs, dances, and magic. Grandfather fire will be there to relieve you of anything you wish to leave behind along with 2013.";

			var mailOptions = {
				from: "Al the Alpaca ✔ <alchemicalalpaca@gmail.com>", // sender address
				to: ticket.email, // list of receivers
				subject: "Your NYE Confirmation", // Subject line
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
