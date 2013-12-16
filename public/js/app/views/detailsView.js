// InfoView.js
// ====================

define(["jquery", "backbone", "text!templates/details.html" ],

    function($, Backbone, template){

    	var InfoView = Backbone.View.extend({

		    tagName: 'div',

			initialize: function () {

				_.bindAll(this, 'render', 'updateModel');

				this.template =  _.template(template);

			},

			render: function () {

				$(this.el).empty();

				this.$el.append(this.template(this.model.toJSON()));

				if (this.model.attributes.first_name !== '') {
					$('#first-name').val(this.model.attributes.first_name);
				}

				if (this.model.attributes.last_name !== '') {
					$('#last-name').val(this.model.attributes.last_name);
				}

				if (this.model.attributes.email !== '') {
					$('#email').val(this.model.attributes.email);
				}

				return this;
			},

			updateModel: function(){

				this.model.set({
					first_name: $('#first-name').val(),
					last_name: $('#last-name').val(),
					email: $('#email').val()
				});
			}

	});

    return InfoView;

	}
);
