define(['pubsub', 'site/pubSubTable'
], function (PubSub, pubSubTable) {

  'use strict';

  var ProfileManager = function () {

    this.initialise = function () {

      //var me = this;

      PubSub.subscribe(pubSubTable.configureProfile, function () {
        // get the asset, show the dialog:


        PubSub.publish(pubSubTable.showProfileDialog);
      });
    };
  };

  return ProfileManager;

});
