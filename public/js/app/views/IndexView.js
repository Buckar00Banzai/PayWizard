// IndexView.js

define(["jquery", "backbone", "text!templates/Index.html"],

    function($, Backbone, template) {

        var SignupView = Backbone.View.extend({

            // The DOM Element associated with this view
            el: ".magic",
            // View constructor
            initialize: function() {

                this.render();

            },

            // View Event Handlers
            events: {

            },

            // Renders the view's template to the UI
            render: function() {

                // Setting the view's template property using the Underscore template method
                this.template = _.template(template, this.model.toJSON());

                // Dynamically updates the UI with the view's template
                this.$el.html(this.template);

                // Maintains chainability
                return this;

            }

        });

        // Returns the View class
        return SignupView;

    }

);
