define(['text!rcap/partials/viewer.htm',
    'rcap/js/ui/gridManager',
    'rcap/js/utils/historyManager',
    'pubsub',
    'site/pubSubTable',
    'controls/factories/controlFactory',
    'rcap/js/serializer',
    'site/siteManager',
    'css!rcap/styles/default.css'
], function(mainPartial, GridManager, HistoryManager, PubSub, pubSubTable, ControlFactory, Serializer, SiteManager) {

    'use strict';

    var Viewer = function() {

        var me = this;

        this.setup = function() {

            $('body').append(mainPartial);

            // site manager: 
            new SiteManager().initialise();

            // grid manager:
            new GridManager().initialise({
                isDesignTime: false
            });

            // serializer:
            new Serializer().initialise();

            // history manager:
            var historyManager = new HistoryManager();
            historyManager.initialise();

            // subscribe to grid done event:
            PubSub.subscribe(pubSubTable.gridInitComplete, function() {

                console.info('viewer: pubSubTable.gridInitComplete');

                me.initialiseControls();

                // if there's a hash value (method that is used to bookmark a 'page'):
                historyManager.setInitialState();
            });
        };

        this.initialiseControls = function() {

            // dependent on notebook_result:
            var interval = setInterval(function() {
                if (window.notebook_result) { // jshint ignore:line

                    clearInterval(interval);

                    _.each(new ControlFactory().getGridControls(), function(control) {
                        control.initialiseViewerItems();
                    });

                }
            }, 500);
        };

        this.initialise = function(json) {

            this.setup();

            // and pub:
            PubSub.publish(pubSubTable.deserialize, {
                isDesignTime: false,
                jsonData: json
            });

        };

    };

    return Viewer;

});