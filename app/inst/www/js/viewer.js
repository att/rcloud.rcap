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

            $('body')
                .addClass('rcap-viewer')
                .append(mainPartial);

            // show the preloader whilst things are initialised:
            $('#rcap-preloader').show();

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

                // initialise the stage width:
                $('#inner-stage').css({
                    'width' : _.last(_.filter([800, 1024, 1280, 1366], function(width) { return (screen.width - 100) > width; })) + 'px',
                    'margin-left' : 'auto',
                    'margin-right' : 'auto'
                });

                ///////////////////////////////////////////////////////
                window.setTimeout(function() {
                    var plotSizes = [];
                    
                    $('.rplot, .r-interactiveplot').each(function() {
                        var container = $(this).closest('.grid-stack-item-content');
                        var currentPlotSize = {
                           id : $(this).attr('id'),
                           width : container.width() - 25,
                           height: container.height() - 25
                        };

                        plotSizes.push(currentPlotSize);

                        // initialise the plot's container with information for later retrieval:
                        container.data({
                            'width' : currentPlotSize.width,
                            'height' : currentPlotSize.height
                        });
                    });

                    var dataToSubmit = JSON.stringify({
                        plotSizes : plotSizes
                    });
                    console.log('Submitting data: ', dataToSubmit);
                    window.RCAP.updateAllControls(dataToSubmit);

                    // show the single page:
                    // if there's a hash value (method that is used to bookmark a 'page'):
                    historyManager.setInitialState();

                    $('#rcap-preloader').fadeOut();

                }, 500);
                ///////////////////////////////////////////////////////                

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

        this.initialise = function(json, sessionInfo) {

            this.setup();
            $('body').data('nodename', sessionInfo.nodeName);

            // and pub:
            PubSub.publish(pubSubTable.deserialize, {
                isDesignTime: false,
                jsonData: json
            });

        };

    };

    return Viewer;

});