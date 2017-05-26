define(['pubsub', 'site/pubSubTable'
], function (PubSub, pubSubTable) {

  'use strict';

  var ProfileManager = function () {

    this.initialise = function () {

      //var me = this;

      PubSub.subscribe(pubSubTable.configureProfile, function () {

        // get the data for the variables

        // 1: variables returned from R,
        // 2: JSON deserialized vars.

        var dummy = _.map(window.RCAP.getVariables(), function(variable) {
          return {
            name: variable,
            value: Math.random().toString(36).substring(7)  // TEMP, needs to come from JSON, where appropriate
          };
        });

        // get the asset, show the dialog:
        PubSub.publish(pubSubTable.showProfileDialog, dummy);
      });
    };
  };

  return ProfileManager;

});
