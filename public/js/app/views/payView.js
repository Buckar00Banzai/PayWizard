// InfoView.js
// ====================

define(["jquery", "backbone", "text!templates/pay.html", "text!templates/confirm.html"],

	function($, Backbone, template, confirmTemplate) {

		var InfoView = Backbone.View.extend({

			tagName: 'div',
			card: null,

			initialize: function() {

				_.bindAll(this, 'render');

				this.template = _.template(template);
				this.confirm = _.template(confirmTemplate);

			},

			events: {
				'click #donate': 'donate',
				'ifChanged input': 'selectCard'
			},

			selectCard: function(e) {
				this.card = $(e.target).attr('id');
			},

			donate: function(e) {
				e.preventDefault();

				var _this = this;

				var model = this.model.toJSON();

				console.log(model);

				for (var property in model) {
					if (model.hasOwnProperty(property)) {
						if(property === 'first_name' || property === 'last_name' || property === 'email') {

							console.log(model[property]);
							if (model[property] === '' || model[property] === undefined || model[property] === null) {

								var msg;
								switch(property) {
									case 'email':
										msg = 'You must provide a valid email address!';
										break;
									case 'first_name':
										msg = 'You must provide your first name!';
										break;
									case 'last_name':
										msg = 'You must provide your last name!';
										break;
								}

								$('#errors').html(msg).fadeIn(400, function() {
									setTimeout(function() {
										$('#errors').fadeOut(400, function() {
											$(this).html('');
										});
									}, 4000);
								});
								return;
							}
						}

					}
				}

				$(e.target).closest('button').removeClass('btn-primary').addClass('btn-warning disabled').html('Processing...');

				var payload = {
					payment: {
						first_name: $('#first_name').val(),
						last_name: $('#last_name').val(),
						type: this.card,
						number: $('#cc-1').val() + $('#cc-2').val() + $('#cc-3').val() + $('#cc-4').val(),
						expire_month: $('#exp-month').val(),
						expire_year: $('#exp-year').val(),
						cvv2: $('#cvv').val()
					},
					ticket: this.model.toJSON()
				};

				$.ajax({
					url: '/api/authPayment',
					type: 'POST',
					dataType: 'JSON',
					data: payload,
				})
					.done(function(data) {
						$(e.target).closest('button').removeClass('btn-warning').addClass('btn-success').html('Redirecting to Paypal...');

						if (data.redirect) {
							window.location.href = data.redirect;
						}
					})
					.fail(function(error) {
						$(e.target).closest('button').removeClass('btn-warning disabled').addClass('btn-primary').html('<i class="fa fa-heart"></i> Donate!');
						$('#errors').html('There was an error processing your donation.  Check your info and try again!').fadeIn(400, function() {
							setTimeout(function() {
								$('#errors').fadeOut(400, function() {
									$(this).html('');
								});
							}, 2000);
						});
					})
					.always(function() {
						$('#cc-1').val('');
						$('#cc-2').val('');
						$('#cc-3').val('');
						$('#cc-4').val('');
						$('.hold-on').hide();
					});


			},

			updateModel: function() {

			},

			render: function() {

				$(this.el).empty();

				this.$el.append(this.template(this.model.toJSON()));

				setTimeout(function() {
					$('input').iCheck({
						radioClass: 'iradio_flat-blue'
					});
					$("#cc-1, #cc-2, #cc-3, #cc-4").inputmask({
						"mask": "9999",
						"placeholder": ""
					});
					$("#exp-month").inputmask({
						"mask": "99",
						"placeholder": ""
					});
					$("#exp-year").inputmask({
						"mask": "9999",
						"placeholder": ""
					});
					$("#cvv").inputmask({
						"mask": "9999",
						"placeholder": ""
					});
				}, 1);

				return this;
			}

		});

		return InfoView;

	}
);
