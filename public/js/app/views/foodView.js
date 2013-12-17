// InfoView.js
// ====================

define(["jquery", "backbone", "text!templates/food.html" ],

    function($, Backbone, template){

    	var foodView = Backbone.View.extend({

		    tagName: 'div',

			initialize: function (options) {

				this.options = options || {};

				_.bindAll(this, 'render', 'updateModel');

				this.template =  _.template(template);

			},

			events: {
				"click #add-food": "addFood"
			},

			addFood: function(e) {
				e.preventDefault();
				var clone = $('.food-input:first');
				clone.clone().appendTo('#food-clone').val('').focus();
			},

			restoreFood: function(food) {
				var clone = $('.food-input:first');
				clone.clone().appendTo('#food-clone').val(food);
			},

			render: function () {

				var _this = this;

				$(this.el).empty();

				this.$el.append(this.template(this.options.base.toJSON()));

				if (this.model.attributes.food.length !== 0) {
					$(this.model.attributes.food).each(function(i, food){
						if(i === 0) {
							$('.food-input:first').val(food);
						} else {
							_this.restoreFood(food);
						}
					});
				}

				return this;
			},

			updateModel: function(){

				var foods = [];

				$('.food-input').each(function(i, food) {
					if($(this).val() === '') {
						return;
					}
					foods.push($(this).val());
				});

				this.model.set({
					food: foods
				});

			}

	});

    return foodView;

	}
);
