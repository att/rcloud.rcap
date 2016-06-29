define(['pubsub', 'site/pubSubTable'], function(PubSub, pubSubTable) {

    'use strict';

    var DirtyStateIndicator = function() {
        this.initialise = function() {

            var isDirty = false,
                el = $('#state-modified i');

            PubSub.subscribe(pubSubTable.saved, function(msg, assetDetails) {
                // only update the dirty flag if this wasn't a theme save:
                if(!assetDetails.wasTheme) {
                    isDirty = false;
                    el.hide();  
                    PubSub.publish(pubSubTable.clearModified);   
                }
            });

            // these events incur a modified state:
            var modifyingEvents = [
                pubSubTable.pageAdded,
                pubSubTable.deletePageConfirm,
                pubSubTable.duplicatePageConfirm,
                pubSubTable.dataSourceAdded,
                pubSubTable.deleteDataSourceConfirm,
                pubSubTable.updateDataSource,
                pubSubTable.updateControl,
                pubSubTable.gridItemsChanged
                // updating themes does not invoke the dirty flag because
                // they are saved when the save button on the theme editor
                // dialog is clicked
            ];

            modifyingEvents.forEach(function(e) {
                PubSub.subscribe(e, function() {
                    isDirty = true;
                    console.log('I showed myself because I got saw an event of type: ', e);
                    el.show();  
                    PubSub.publish(pubSubTable.setModified); 
                });
            });

        };
    };

    return DirtyStateIndicator;
});
