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
        PubSub.subscribe(pubSubTable.showViewerProfileDialog, function(msg, profileVariables) {

          // for each profile variable, get the possible and user saved values:
          var promises = _.flatten(_.map(profileVariables, function(profileVariable) {
            return [
              window.RCAP.getUserProfileVariableValues(profileVariable),
              window.RCAP.getUserProfileValue(profileVariable)
            ];
          }));

          var profileData = [];

          Promise.all(promises).then(function(res) {
            for(var loop = 0; loop < res.length / 2; loop++) {
              profileData.push({
                // name, all, user
                name: profileVariables[loop],
                all: _.pluck(res[loop * 2], 'value'),
                user: _.pluck(res[(loop * 2) + 1], 'value')
              });
            }
          });

          $('#dialog-viewerProfileSettings').jqmShow();
        });
      }
    });

    return ViewerDialogManager;
});
