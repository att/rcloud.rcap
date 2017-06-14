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
        var tr = $(this).closest('tr');
        tr.find('[data-selectionmethod]').hide();
        tr.find('[data-selectionmethod="' + $(this).val() + '"]').show();

        if($(this).val() === 'all') {
          tr.find('select')
            .removeAttr('data-parsley-required')
            .parsley('destroy');
        } else {
          tr.find('select')
            .attr('data-parsley-required', 'true')
            .parsley();
        }
      });

      $('#dialog-viewerProfileSettings .approve').on('click', function() {

          $('#profile-form').parsley().validate();

          if ($('#profile-form').parsley().isValid()) {
            var data = { updatedVariables: [] };

            $.each($('#profile-form tbody tr'), function(index, row) {

              var value = $(row).find('.selection-method select').val() === 'all' ? null : $(row).find('.values select').val(),
                  previousHash = $(row).data('valuehash'),
                  newHash = profileManager.hashValues(value);

              // if something's changed, push the updated variable:
              if(previousHash !== newHash) {
                data.updatedVariables.push({
                  variableName: $(row).data('variablename'),
                  controlId: $(row).data('id'),
                  value: $(row).find('.selection-method select').val() === 'all' ? null : $(row).find('.values select').val()
                });
              }
            });

            console.log('updating profile variables with: ', data);

            // only update if there's something to update:
            if(data.updatedVariables.length) {
              profileManager.updateProfileVariables(data);
            }

            $('.jqmWindow').jqmHide();
          } else {
            $('.jqmWindow .body').animate({ scrollTop: 0 }, 'fast');
          }
      });

      PubSub.subscribe(pubSubTable.showViewerProfileDialog, function (msg, profileVariables) {

        var initViewerProfileDialog = function(items) {

          // are any values stale for any of the items?
          var hasStaleItem = _.filter(items, function(item) {
            return item.staleValues.length > 0;
          }).length > 0;

          var template = _.template(viewerProfileVariablesTpl);

          var html = (template({
            profileDataItems: items,
            hasStaleItem: hasStaleItem
          }));

          $('#dialog-viewerProfileSettings form').html(html);

          $('#dialog-viewerProfileSettings form tr').each(function(index, tr) {
            if($(tr).find('div[data-selectionmethod="selected"]:visible')) {
              $(tr).find('select')
                .attr('data-parsley-required', 'true')
                .parsley();
            }
          });

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
