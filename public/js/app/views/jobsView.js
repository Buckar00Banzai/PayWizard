// InfoView.js
// ====================

define(["jquery", "backbone", "icheck", "models/baseModel", "text!templates/jobs.html"],

	function($, Backbone, iCheck, Base, template) {

		var InfoView = Backbone.View.extend({

			tagName: 'div',

			initialize: function(options) {

				this.options = options || {};

				_.bindAll(this, 'render', 'updateModel');

				this.template = _.template(template);

				console.log(this.options.base.toJSON());


			},

			initHoverHelp: function() {

                var ele = $('.job-description'),
                	title = $('.job-title');

                $('.tt').mouseover(function(e) {

                    var message = $(this).data('message');
                    	jobTitle = $(this).data('title');

                    ele.html(message);

                    title.html(jobTitle);

                });

                $('.tt').mouseout(function(e) {
                    ele.html('');
                    title.html('');
                });

            },

			render: function() {

				var _this = this;

				$(this.el).empty();

				this.$el.append(this.template(this.options.base.toJSON()));

				setTimeout(function() {
					$('input').iCheck({
						radioClass: 'iradio_flat-blue'
					});
					_this.initHoverHelp();
				}, 1);

				return this;

			},

			updateModel: function() {

				this.model.set({
					// company: $('input[name=company]',this.el).val(),
					// title: $('input[name=title]',this.el).val(),
					// phone: $('input[name=phone]',this.el).val(),
					// street: $('input[name=street]',this.el).val(),
					// street2: $('input[name=street2]',this.el).val(),
					// city: $('input[name=city]',this.el).val(),
					// state: $('input[name=state]',this.el).val(),
					// zip: $('input[name=zip]',this.el).val(),
					// country: $('input[name=country]',this.el).val()
				});
			}

		});

		return InfoView;

	}
);
