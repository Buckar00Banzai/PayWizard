// IndexModel.js

define(["jquery", "backbone"],

    function($, Backbone) {

        // Creates a new Backbone Model class object
        var baseModel = Backbone.Model.extend({

            url: '/api/base',

            // Model Constructor
            initialize: function() {

            },

            // Default values for all of the Model attributes
            defaults: {

            },

            // Gets called automatically by Backbone when the set and/or save methods are called (Add your own logic)
            validate: function(attrs) {

            }

        });

        // Returns the Model class
        return baseModel;

    }

);
