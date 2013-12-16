// InfoView.js
// ====================

define(["jquery", "backbone", "icheck", "models/baseModel", "text!templates/jobs.html"],

	function($, Backbone, iCheck, Base, template) {

		var InfoView = Backbone.View.extend({

			tagName: 'div',

			job: null,

			initialize: function(options) {

				this.options = options || {};

				_.bindAll(this, 'render', 'updateModel');

				this.template = _.template(template);

			},

			events: {
				'ifChanged input': 'selectJob'
			},

			selectJob: function(e) {
				this.job = $(e.target).attr('id');
			},

			initHoverHelp: function() {

                var ele = $('.job-description'),
                	title = $('.job-title');


				$('.tt').click(function(e) {

                    var message = $(this).data('message');
                    	jobTitle = $(this).data('title');

                    ele.html(message);

                    title.html(jobTitle);

                });

				$('input[name=jobs]').on('ifChanged', function(e) {

                    var message = $(this).parent().parent().find('.tt').data('message');
                    	jobTitle = $(this).parent().parent().find('.tt').data('title');

                    ele.html(message);

                    title.html(jobTitle);

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

				if(this.job !== null) {
					$('#' + this.job).iCheck('check');
				}

				return this;

			},

			updateModel: function() {

				var _this = this;

				this.model.set({
					job: _this.job
				});

			}

		});

		return InfoView;

	}
);
