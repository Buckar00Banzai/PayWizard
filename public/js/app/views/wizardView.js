// WizardView.js
// ====================

define(["jquery", "backbone", "events/Notifier", "text!templates/wizard.html"],

    function($, Backbone, Notifier, template){

        var WizardViews = function () {

            var Node = function (view) {
                var _next = null; //reference next node
                var _previous = null; //reference previus node
                var _view = view.ref; //referce current view
                var _tab = view.tab;
                var _progress = view.progress;
                return {
                    setPrevious: function (node) { _previous = node; return this; }, //chainable!
                    getPrevious: function () { return _previous; },
                    setNext: function (node) { _next = node; return this; }, //chainable!
                    getNext: function () { return _next; },
                    getView: function () { return _view; },
                    getTab: function () { return _tab; },
                    getProgress: function () { return _progress; }
                };
            };

            var _head = null;
            var _tail = null;
            var _current = null;

            return {
                first: function () { return _head; },
                last: function () { return _tail; },
                moveNext: function () {
                    return (_current !== null) ? _current = _current.getNext() : null;
                }, //set current to next and return current or return null
                movePrevious: function () {
                    return (_current !== null) ? _current = _current.getPrevious() : null;
                }, //set current to previous and return current or return null
                getCurrent: function () { return _current; },
                insertView: function (view) {
                    if (_tail === null) { // list is empty (implied head is null)
                        _current = _tail = _head = new Node(view);
                    }
                    else {//list has nodes
                        _tail = _tail.setNext(new Node(view).setPrevious(_tail)).getNext();
                    }
                },
                setCurrentByTab: function (tab) {
                    var node = _head;
                    while (node !== null) {
                        if (node.getTab() !== tab) { node = node.getNext(); }
                        else { _current = node; break; }
                    }
                }
            };
        };

    var WizardView = Backbone.View.extend({
            tagName: 'div',
            initialize: function () {
                _.bindAll(this, 'render', 'movePrevious', 'moveNext', 'insertView', 'save', 'moveToTab');
                this.template = _.template(template, {});
                this.$el.append(this.template);
                this.wizardViewTabs = $(this.el).find('#wizard-view-tabs');
                this.wizardViewContainer = $(this.el).find('#wizard-view-container');
                this.wizardProgressBar = $(this.el).find('.bar');
                this.wizardViews = new WizardViews();
            },
            events: {
                "click .btn-previousView": "movePrevious",
                "click .li-previousView": "movePrevious",
                "click .btn-nextView": "moveNext",
                "click .li-nextView": "moveNext",
                "click .btn-save": "save",
                "click .bwizard-steps a": "moveToTab",
                "click .bwizard-steps li": "moveToTab"

            },

            render: function () {
                var currentView = this.wizardViews.getCurrent();
                if (currentView !== null) {

                    if (currentView.getNext() === null) {
                        $('.btn-nextView', this.el).parent().hide();
                    } else {
                        $('.btn-nextView', this.el).parent().css('display', 'inline-block').show();
                    }
                    if (currentView.getPrevious() === null) {
                        $('.btn-previousView', this.el).parent().hide();
                    } else {
                        $('.btn-previousView', this.el).parent().show();
                    }

                    //clear the active tab css class
                    this.wizardViewTabs.
                        find('li').removeClass('active');

                    //Label Active State Clear
                    this.wizardViewTabs.
                        find('.label').removeClass('label-inverse');

                    //set the active tab for the current view
                    this.wizardViewTabs.
                        find('a[title=' + currentView.getTab() + ']').
                        parents('li:first').addClass('active');

                    // Label active state
                    this.wizardViewTabs.
                        find('li[title=' + currentView.getTab() + '] span').addClass('label-inverse');

                    //show only the current view
                    this.wizardViewContainer.find('.wizard-view:parent').hide();
                    $(currentView.getView().render().el).show();


                    // Move progress bar
                    this.wizardProgressBar.css('width', currentView.getProgress());

                }
                return this;
            },
            insertView: function (view) {

                var tab = view.tab;
                view.tab = view.tab.replace(/\s/g, '-');

                this.wizardViewTabs.
                    append('<li title="' + view.tab + '" disabled><span class="label">'+ view.nu +'</span><a href="#' + view.tab + '" title="' + view.tab + '" disabled>' + tab + '</a></li>');

                this.wizardViewContainer.append($(view.ref.render().el).hide());
                this.wizardViews.insertView(view);
            },
            movePrevious: function () {
                this.updateModel();
                this.wizardViews.movePrevious();
                this.render();
                return false;
            },

            moveNext: function () {
                this.updateModel();
                this.wizardViews.moveNext();
                this.render();
                return false;
            },
            moveToTab: function (e) {
                e = e || window.event;
                var anchor = $(e.srcElement || e.target);
                this.updateModel();
                this.wizardViews.setCurrentByTab($(anchor).attr('title'));
                this.render();
                return false;
            },
            updateModel: function () {
                this.wizardViews.getCurrent().getView().updateModel();
                //favor view update method convention to force synchronous updates
            },
            save: function () {
                this.updateModel();
                alert(JSON.stringify(this.model.toJSON()));
            }
        });

        var _wizardView = null;

        return {
            initialize: function(wizardModel){
                _wizardView = new WizardView({model:wizardModel});
            },
            insertView: function (view) {
                _wizardView.insertView(view);
            },
            render: function () {
                return _wizardView.render();
            }
        };
    }
);
