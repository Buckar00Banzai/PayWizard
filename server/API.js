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

	server.get('/success', function(req, res, next) {

			if (!req.query.PayerID) {
				res.send(500);
				return;
			}

			var execute_payment_details = {
				"payer_id": req.query.PayerID
			};
			paypal_sdk.payment.execute(req.session.paymentID, execute_payment_details, function(error, payment) {
				if (error) {
					console.error(error);
				} else {
					req.session.payment = payment;
					console.log(req.session.ticket.first_name + ' ' + req.session.ticket.last_name + ' bought a ticket!');
					next();
				}
			});
		},
		Ticket.createTicket,
		Base.updateBase,
		function(req, res) {

			var ticket = req.session.ticket,
				payment = req.session.payment,
				j, ct;

			if(!ticket.food) {
				ticket.food = ['TBD'];
			}

			if (!ticket.job) {
				ticket.job = j = ct = 'TBD';

			}

			switch (ticket.job) {
				case 'dinnerPrep':
					j = 'Dinner Preparation';
					ct = '2pm';
					break;
				case 'dinnerClean':
					j = 'Dinner Clean Up';
					ct = '4pm';
					break;
				case 'brunchPrep':
					j = 'Brunch Preparation';
					ct = 'Be prepaired to stay until 2pm on the 1st.';
					break;
				case 'brunchClean':
					j = 'Brunch Clean Up';
					ct = 'Be prepaired to stay until 2pm on the 1st.';
					break;
				case 'altar':
					j = 'Altar';
					ct = '2pm';
					break;
				case 'templeSetup':
					j = 'Temple Setup';
					ct = '2pm';
					break;
				case 'templeBreakdown':
					j = 'Temple Breakdown';
					ct = 'Be prepaired to stay until 2pm on the 1st.';
					break;
				case 'pointman':
					j = 'Point Person';
					ct = '2pm';
					break;
				case 'tea':
					j = 'Tea Preparation';
					ct = '2pm';
					break;
				case 'teaSetup':
					j = 'Tea Setup';
					ct = '4pm';
					break;
				case 'music':
					j = 'Musician';
					ct = '2pm';
					break;
				case 'musicSetup':
					j = 'Music Setup';
					ct = '2pm';
					break;
				case 'musicBreakdown':
					j = 'Music Breakdown';
					ct = 'Be prepaired to stay until 2pm on the 1st.';
					break;
				case 'fire':
					j = 'Firekeeper';
					ct = '4pm';
					break;
			}

			console.log(payment);

			var text = "Hey, this is a confirmation that your donation was accepted and a spot is being held for you at our gathering on New Year's Eve. Grab an extra blankie and an altar piece and alpaca your bags!\n\n";
			text = text + "DONATION DETAILS:\n\n";
			text = text + "Total: $" + payment.transactions[0].amount.total + '\n';
			text = text + "Payment Method: " + payment.payer.payment_method + '\n';
			text = text + "Account: " + payment.payer.payer_info.email + '\n';
			text = text + "State: " + payment.state + "\n\n";
			text = text + "CONTRIBUTION DETAILS: \n\n";
			text = text + "Activate: " + j + " (Call Time: " + ct + ")\n";
			text = text + "Generate: " + ticket.food.join(', ') + "\n\n";
			text = text + "Bring offerings of flowers, fruit, chocolate, candles, feathers, stones, sage, incense, words, laughter, songs, dances, and magic. Grandfather fire will be there to relieve you of anything you wish to leave behind along with 2013.\n\n";

			text = text + "DIRECTIONS:  20 Jennings Rd., Greenville, NY (about 2.5 hours from NYC, 45 minutes from Woodstock).\n\n";

			text = text + 'From the south:\n\n';
			text = text + 'I-87 N\n';
			text = text + 'Take exit 21 toward RT 23/Catskill (.6 mi)\n';
			text = text + 'Turn left at CR-23B (.3 mi)\n';
			text = text + 'Slight right onto 23W (7.7 mi)\n';
			text = text + 'Slight right at RT 32 (10.7 mi)\n';
			text = text + 'Turn left at CR-405 (.2 mi)\n';
			text = text + 'Turn left at Jennings rd\n\n';

			text = text + 'From the North:\n\n';
			text = text + 'I-87 S\n';
			text = text + 'Take exit 21B for US-9W S toward Coxsackie/RT-81 (.3 mi)\n';
			text = text + 'Turn left at US-9W (2.2 mi)\n';
			text = text + 'Turn right at RT-81 (1.0 mi)\n';
			text = text + 'Turn right at CR-26 (5.2 mi)\n';
			text = text + 'Turn right at Hillcrest Rd (3.6 mi)\n';
			text = text + 'Slight left at CR-38 (1.4 mi)\n';
			text = text + 'Continue on CR-405 (1.2 mi)\n';
			text = text + 'Turn left at Jennings Rd\n\n';

			text = text + 'Bus/Train:\n\n';

			text = text + 'There is a bus that leaves from Port Authority, NYC on Adirondack Trailways, it connects through Kingston, NY and you get off at Karen’s Flower Shop in Cairo, NY, the stop is called Cairo Junction. There is no regular taxi service here, but you can call Lee’s taxi (518-966-4861) and make an appointment ahead of time. It’s a 15 minute ride to the house. Also you can take Amtrak from Penn Station to Hudson, NY and take a regular taxi from there. It’s a 40 minute ride to the house.';

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
					res.redirect('/#success');

				}

				//smtpTransport.close(); // shut down the connection pool, no more messages
			});
		}

	);

	server.post('/api/authPayment', function(req, res) {

		req.session.ticket = req.body.ticket;

		var payment_details = {
			"intent": "sale",
			"payer": {
				"payment_method": "paypal"
			},
			"redirect_urls": {
				"return_url": Config.paypal.return_url,
				"cancel_url": Config.paypal.cancel_url
			},
			"transactions": [{
				"amount": {
					"total": "77.48",
					"currency": "USD",
					"details": {
						"subtotal": "77.48"
					}
				},
				"item_list": {
					"items": [{
						"quantity": "1",
						"name": "Donation",
						"price": "77.48",
						"sku": "NYE",
						"currency": "USD"
					}]
				},
				"description": "NYE Donation"
			}]
		};

		paypal_sdk.payment.create(payment_details, function(error, payment) {
			if (error) {
				res.send(400, error);
				console.log(error);
				console.log(error.response.details)
			} else {
				req.session.paymentID = payment.id;
				res.send({
					redirect: payment.links[1].href
				});
			}
		});

	});

}
