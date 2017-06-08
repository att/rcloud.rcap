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

      // custom validation:
      // window.Parsley.addValidator('selection', {

      // });

      window.ParsleyValidator.addValidator('variablevalidator',
      function (value, requirement) {
        if($(requirement).parsley().$element.val() === 'selected' && !value.length){
          return false;
        }
      }, 32).addMessage('en', 'variablevalidator', 'You must select at least one variable value');

      ////////////////////////////////////////////////////////////////////////////////
      //
      // designer profile settings:
      //
      $('#dialog-viewerProfileSettings').on('change', '.selection-method select', function() {
        $(this).closest('tr').find('[data-selectionmethod]').hide();
        $(this).closest('tr').find('[data-selectionmethod="' + $(this).val() + '"]').show();
      });

      $('#dialog-viewerProfileSettings .approve').on('click', function() {

          $('#profile-form').parsley().validate();

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

          var html = (template({
            profileDataItems: items
          }));

          $('#dialog-viewerProfileSettings form').html(html);

          $('#dialog-viewerProfileSettings tr > td:nth-child(3) select').select2({
            width: '600px',
            placeholder: 'Select a value'
          });

          $('#dialog-viewerProfileSettings td.values .select2').find('.select2-search__field').removeAttr('style');


          $('#dialog-viewerProfileSettings form').parsley({
            errorsContainer: function(parsleyField) {
              return parsleyField.$element.closest('fieldset').find('.errors');
            }
          });

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
