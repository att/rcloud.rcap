define([
    'pubsub',
    'site/pubSubTable',
    'rcap/js/ui/dialogUtils',
        'text!rcap/partials/dialogs/_viewerProfileSettings.htm'
], function(PubSub, pubSubTable, DialogUtils, configuratorPartial) {

    'use strict';

    var ViewerDialogManager = Class.extend({
      initialise: function() {

        // configure the configurator dialog:
        // #dialog-viewerProfileSettings
        $('#rcap-viewer').append(configuratorPartial);

        new DialogUtils().initialise();

        ////////////////////////////////////////////////////////////////////////////////
        //
        // designer profile settings:
        //
        PubSub.subscribe(pubSubTable.showViewerProfileDialog, function(/*msg, profileVariables*/) {
          $('#dialog-viewerProfileSettings').jqmShow();
        });
      }
    });

    return ViewerDialogManager;
});
