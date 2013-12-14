// InfoView.js
// ====================

define(["jquery", "backbone", "text!templates/cloud/wizard/info.html" ],

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

				return this;
			},

			updateModel: function(){

				this.model.set({
					company: $('input[name=company]',this.el).val(),
					title: $('input[name=title]',this.el).val(),
					phone: $('input[name=phone]',this.el).val(),
					street: $('input[name=street]',this.el).val(),
					street2: $('input[name=street2]',this.el).val(),
					city: $('input[name=city]',this.el).val(),
					state: $('input[name=state]',this.el).val(),
					zip: $('input[name=zip]',this.el).val(),
					country: $('input[name=country]',this.el).val()
				});
			}

	});

    return InfoView;

	}
);
