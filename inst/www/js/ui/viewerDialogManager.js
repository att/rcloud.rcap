define([
  'pubsub',
  'site/pubSubTable',
  'rcap/js/ui/dialogUtils',
  'text!rcap/partials/dialogs/_viewerProfileSettings.htm',
  'text!rcap/partials/dialogs/templates/viewerProfileVariables.tpl',
], function (PubSub, pubSubTable, DialogUtils, configuratorPartial, viewerProfileVariablesTpl) {

  'use strict';

  var ViewerDialogManager = Class.extend({
    initialise: function () {

      // configure the configurator dialog:
      // #dialog-viewerProfileSettings
      $('#rcap-viewer').append(configuratorPartial);

      new DialogUtils().initialise();

      ////////////////////////////////////////////////////////////////////////////////
      //
      // designer profile settings:
      //

      // TODO: initialise the event for the select onchange event (showing only one '.options-panel' at any one time)
      $('#dialog-viewerProfileSettings').on('change', 'select', function() {
        $('#dialog-viewerProfileSettings .options-panel').hide();
        $('#dialog-viewerProfileSettings .options-panel:eq(' + $(this)[0].selectedIndex + ')').show();
      });

      PubSub.subscribe(pubSubTable.showViewerProfileDialog, function (msg, profileVariables) {

        // for each profile variable, get the possible and user saved values:
        var promises = _.flatten(_.map(profileVariables, function (profileVariable) {
          return [
            window.RCAP.getUserProfileVariableValues(profileVariable),
            window.RCAP.getUserProfileValue(profileVariable)
          ];
        }));

        var profileDataItems = [];

        var initViewerProfileDialog = function(items) {
          var template = _.template(viewerProfileVariablesTpl);

          var html = (template({
            profileDataItems: items
          }));

          $('#dialog-viewerProfileSettings form').html(html);
          $('#dialog-viewerProfileSettings form .options-panel:eq(0)').show();
          $('#dialog-viewerProfileSettings').jqmShow();
        };

        function getOptions(allValues, userValues) {
          return _.map(allValues, function(item) { return {
                  value: item.value,
                  selected: _.pluck(userValues, 'value').indexOf(item.value) !== -1
                };
              });
        }

        Promise.all(promises).then(function (res) {
          for (var loop = 0; loop < res.length / 2; loop++) {
            profileDataItems.push({
              // name, all, user
              name: profileVariables[loop],
              options: getOptions(res[loop * 2], res[(loop * 2) + 1])
            });
          }

          initViewerProfileDialog(profileDataItems);
        });
      });
    }
  });

  return ViewerDialogManager;
});
