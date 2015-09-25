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
            new HistoryManager().initialise();

            // subscribe to grid done event:
            PubSub.subscribe(pubSubTable.gridInitComplete, function() {

                console.info('viewer: pubSubTable.gridInitComplete');

                me.initialiseControls();
            });
        };

        this.initialiseControls = function() {
            _.each(new ControlFactory().getGridControls(), function(control) {
                control.initialiseViewerItems();
            });
        };

        this.initialiseFromMenu = function() {

            this.setup();

            $('#rcap-viewer').css({
                'margin-top': '-50px'
            }).show();

            PubSub.publish(pubSubTable.deserialize, {
                isDesignTime: false
            });

            setTimeout(function() { $(document).off('scroll'); }, 2000);
            
        };

        /*
                this.initialise = function(json) {

                    this.setup();

                    // subscribe to grid done event:
                    PubSub.subscribe(pubSubTable.gridInitComplete, function() {

                        console.info('viewer: pubSubTable.gridInitComplete');

                        me.initialiseControls();
                    });

                    // and pub:
                    PubSub.publish(pubSubTable.deserialize, {
                        isDesignTime: false,
                        jsonData: json
                    });

                };
        */

    };

    return Viewer;

});
