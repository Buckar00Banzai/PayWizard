// Router.js

define(["jquery", "backbone", "models/baseModel", "views/IndexView", "views/SignupView", "views/SuccessView", "collections/IndexCollection"],

    function($, Backbone, Base, IndexView, SignupView, SuccessView, Collection) {

        var Router = Backbone.Router.extend({

            initialize: function() {

                // Tells Backbone to start watching for hashchange events
                Backbone.history.start();

            },

            // All of your Backbone Routes (add more)
            routes: {

                // When there is no hash on the url, the home method is called
                "": "index",
                "signup": "signup",
                "success": "success"

            },

            success: function() {
                new SuccessView();
            },

            signup: function() {

                var _this = this;

                var base = new Base();
                base.fetch({
                    success: function() {
                        if(base.get('tickets') > 0) {
                            new SignupView();
                        } else {
                            _this.navigate('/', true);
                        }
                    }
                })
            },

            index: function() {

                var base = new Base();

                base.fetch({
                    success: function() {
                        new IndexView({model: base});
                        this.base = base;
                    }
                });

            }

        });

        // Returns the DesktopRouter class
        return Router;

    }

);
