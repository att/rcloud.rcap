define([
  'pubsub',
  'site/pubSubTable',
  'rcap/js/ui/dialogUtils',
  'text!rcap/partials/dialogs/_viewerProfileSettings.htm',
  'text!rcap/partials/dialogs/templates/viewerProfileVariables.tpl',
  'site/profileVariableManager',
  'parsley',
], function (PubSub, pubSubTable, DialogUtils, configuratorPartial, viewerProfileVariablesTpl, ProfileVariableManager) {

  'use strict';

  var profileManager = new ProfileVariableManager();

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
      $('#dialog-viewerProfileSettings').on('change', '.selection-method select', function() {
        $(this).closest('tr').find('.values select')[$(this).val() === 'all' ? 'hide' : 'show']();
      });

      $('#dialog-viewerProfileSettings .approve').on('click', function() {

          //$('#profile-form').parsley().validate();

          if ($('#profile-form').parsley().isValid()) {
            var data = { updatedVariables: [] };

            $.each($('#profile-form tbody tr'), function(index, row) {
              data.updatedVariables.push({
                variableName: $(row).data('variablename'),
                controlId: $(row).data('id'),
                value: $(row).find('.selection-method').val() === 'all' ? [] : $(row).find('.values select').val()
              });
            });

            profileManager.updateProfileVariables(data);

            $('.jqmWindow').jqmHide();
          } else {
            $('.jqmWindow .body').animate({ scrollTop: 0 }, 'fast');
          }
      });

      PubSub.subscribe(pubSubTable.showViewerProfileDialog, function (msg, profileVariables) {

        var initViewerProfileDialog = function(items) {
          var template = _.template(viewerProfileVariablesTpl);

          //console.log('passing into the template: ', items);
          var html = (template({
            profileDataItems: items
          }));

          $('#dialog-viewerProfileSettings form').html(html);
          /*
          $('#dialog-viewerProfileSettings form').parsley({
            errorsContainer: function(parsleyField) {
              return parsleyField.$element.closest('fieldset').find('.errors');
            }
          });*/
          //$('#dialog-viewerProfileSettings form .options-panel:eq(0)').show();

          //$('.js-example-basic-multiple:eq(0)').select2();

          $('.jqmWindow .body').animate({ scrollTop: 0 }, 'fast');
          $('#dialog-viewerProfileSettings').jqmShow();
        };

        profileManager.getProfileVariableData(profileVariables).then(function(profileDataItems) {
          initViewerProfileDialog(profileDataItems);
        });
      });
    }
  });

  return ViewerDialogManager;
});
