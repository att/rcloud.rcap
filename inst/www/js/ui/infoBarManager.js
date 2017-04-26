define(['pubsub', 'site/pubSubTable'], function(PubSub, pubSubTable) {

	'use strict';

    var InfoBarManager = function() {

        this.initialise = function() {

            PubSub.subscribe(pubSubTable.changeSelectedPage, function(msg, page) {
                $('#current-page')
                  .data('id', page.id)
                  .html(page.navigationTitle);
            });

            PubSub.subscribe(pubSubTable.updatePage, function(msg, page) {
                if($('#current-page').data('id') === page.id) {
                  $('#current-page').html(page.navigationTitle);
                }
            });

            //
            $('#current-page-status').click(function() {
                PubSub.publish(pubSubTable.showPageFlyout);
            });

            this.initialise = function() {};
        };
    };

	return InfoBarManager;
});
