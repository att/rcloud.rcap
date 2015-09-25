define(['text!rcap/partials/viewer.htm',
    'rcap/js/ui/gridManager',
    'rcap/js/utils/historyManager',
    'pubsub',
    'site/pubSubTable',
    'rcap/js/serializer',
    'site/siteManager',
    'css!rcap/styles/default.css'
], function(mainPartial, GridManager, HistoryManager, PubSub, pubSubTable, Serializer, SiteManager) {

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

            var notebookResult = window.notebook_result; // jshint ignore:line

            // some controls are dependent on having a valid notebook result:
            if (notebookResult) {
                $('.r').each(function(i, e) {
                    if (typeof notebookResult[$(e).attr('id')] === 'function') {
                        var $enclosingDiv = $(e).closest('.grid-stack-item-content');

                        notebookResult[$(e).attr('id')]({
                            width: $enclosingDiv.width() * 1.5,
                            height: $enclosingDiv.height() * 1.5
                        }, $.noop());

                    } else {
                        $(e).css({
                                'color': 'red',
                                'font-weight': 'bold',
                                'border': '1px solid red'
                            })
                            .text('the function ' + $(e).attr('id') + '() does not exist...');
                    }
                });
            }

            // everything that doesn't rely on a notebook result:
            $('#rcap-viewer').on('click', '.rcap-pageMenu a', function() {
                // get the nav title:
                PubSub.publish(pubSubTable.changeSelectedPageByTitle, $(this).data('href'));
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

            $(document).off('scroll');
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
