define(['text!rcap/partials/viewer.htm',
    'rcap/js/ui/gridManager',
    'pubsub',
    'rcap/js/serializer',
    'text!rcap/partials/_top-banner.htm',                       // DEMO
    'css!rcap/styles/default.css'
], function(mainPartial, GridManager, PubSub, serializer, topBannerPartial) {

    'use strict';

    return {

        initialiseFromMenu: function() {

            if ($('body').find('#rcap-viewer').length === 0) {

                $('body').append(mainPartial);

                // grid:
                var gridManager = new GridManager();
                gridManager.initialise();

                // initialise
                serializer.initialise();

                $('#rcap-viewer .close').show();

                $('#rcap-viewer .close').click(function() {
                    $('#rcap-viewer').hide();
                });

            }

            $('#top-banner').replaceWith(topBannerPartial);

            $('#rcap-viewer').show();

            // kick off:
            PubSub.publish('rcap:deserialize', {
                type: 'viewer'
            });

        },

        initialise: function(json) {

            // subscribe to grid done event:
            PubSub.subscribe('grid:initcomplete', function() {

                var noop = function() {};
                var notebookResult = window.notebook_result; // jshint ignore:line

                $('.r').each(function(i, e) {
                    if (typeof notebookResult[$(e).attr('id')] === 'function') {
                        var $enclosingDiv = $(e).closest('.grid-stack-item-content');
                        
                        //notebookResult[$(e).attr('id')]($enclosingDiv.width() * 1.5, $enclosingDiv.height() * 1.5, noop);

                        notebookResult[$(e).attr('id')]({
                            width: $enclosingDiv.width() * 1.5, 
                            height: $enclosingDiv.height() * 1.5
                        }, noop);  

                    } else {
                        $(e).css({
                                'color': 'red',
                                'font-weight': 'bold',
                                'border': '1px solid red'
                            })
                            .text('the function ' + $(e).attr('id') + '() does not exist...');
                    }
                });

            });

            $('body').html(mainPartial);


            $('#top-banner').replaceWith(topBannerPartial);

            // initialise grid:
            var gridManager = new GridManager();
            gridManager.initialise();

            serializer.initialise();

            // and pub:
            PubSub.publish('rcap:deserialize', {
                type: 'viewer',
                jsonData: json
            });

        }
    };
});
