define([
    'pubsub',
    'site/pubSubTable',
    'text!rcap/partials/_404.htm'
], function(PubSub, pubSubTable, pageNotFoundPartial) {

    'use strict';

    var HistoryManager = function() {

        var pageNotFoundSelector = '#viewer-404';

        this.initialise = function() {

            // append the '404':
            $('#inner-stage').append('<div id="viewer-404" style="display:none"></div>');

            window.addEventListener('popstate', function( /*e*/ ) {
                console.log('history manager: popstate');
            });

            window.onhashchange = function() {

                // assume that this will be found:
                $(pageNotFoundSelector).hide();

                PubSub.publish(pubSubTable.changeSelectedPageByTitle, location.hash.substring(1));
            };

            PubSub.subscribe(pubSubTable.show404, function(msg, data) {
                var template = _.template(pageNotFoundPartial);
                $(pageNotFoundSelector).html(template({
                    pages : data.site.pages,
                    requestedPage : data.requestedPage
                })).show();

            });

        };

        this.setInitialState = function() {
            if (location.hash.length) {
                // show the specific 'page':
                PubSub.publish(pubSubTable.changeSelectedPageByTitle, location.hash.substring(1));
            } else {
                // the first is as good as any:
                PubSub.publish(pubSubTable.viewerShowFirstPage);
            }
        };

    };

    return HistoryManager;

});
