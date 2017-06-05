define([
  'pubsub',
  'site/pubSubTable',
  'rcap/js/ui/dialogUtils',
  'text!rcap/partials/dialogs/_viewerProfileSettings.htm',
  'text!rcap/partials/dialogs/templates/viewerProfileVariables.tpl',
  'parsley',
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

      $('#dialog-viewerProfileSettings').on('change', 'select', function() {
        $('#profile-form').parsley().validate();
        if($('#profile-form').parsley().isValid()) {
          // set new value:
          $(this).data('value', $(this).val());
          $('#dialog-viewerProfileSettings .options-panel').hide();
          $('#dialog-viewerProfileSettings .options-panel:eq(' + $(this)[0].selectedIndex + ')').show();
        } else {
          $(this).val($(this).data('value'));
        }
      });

      $('#dialog-viewerProfileSettings .body').on('click', 'button', function(e) {

        $(this).closest('fieldset').find(':checkbox')
          .prop('checked', $(this).data('action') === 'all');

        e.preventDefault();
        return false;
      });

      $('#dialog-viewerProfileSettings .approve').on('click', function() {
          $('#profile-form').parsley().validate();

          if ($('#profile-form').parsley().isValid()) {
            var selectedVariableValues = [];

            $.each($('.options-panel'), function(index, div) {
              selectedVariableValues.push({
                variableName: $(div).data('variablename'),
                controlId: $(div).data('id'),
                // if all are selected, set to '[]' (counter-intuitive, but it implies that they want 'all'):
                value: $(div).find(':checkbox:checked').length === $(div).find(':checkbox').length ? [] : _.map($(div).find(':checkbox:checked'), function(cb) { return cb.value; })
              });
            });

            window.RCAP.updateControls(JSON.stringify(selectedVariableValues));
            //console.log(selectedVariableValues);

            $('.jqmWindow').jqmHide();
          } else {
            $('.jqmWindow .body').animate({ scrollTop: 0 }, 'fast');
          }
      });

      PubSub.subscribe(pubSubTable.showViewerProfileDialog, function (msg, profileVariables) {

        // for each profile variable, get the possible and user saved values:
        var promises = _.flatten(_.map(profileVariables, function (profileVariable) {
          return [
            window.RCAP.getUserProfileVariableValues(_.findWhere(profileVariable.controlProperties, { 'uid': 'variablename' }).value),
            window.RCAP.getUserProfileValue(_.findWhere(profileVariable.controlProperties, { 'uid': 'variablename' }).value)
          ];
        }));

        var profileDataItems = [];

        var initViewerProfileDialog = function(items) {
          var template = _.template(viewerProfileVariablesTpl);

          var html = (template({
            profileDataItems: items
          }));

          $('#dialog-viewerProfileSettings form').html(html);
          $('#dialog-viewerProfileSettings form').parsley({
            errorsContainer: function(parsleyField) {
              return parsleyField.$element.closest('fieldset').find('.errors');
            }
          });
          $('#dialog-viewerProfileSettings form .options-panel:eq(0)').show();
          $('.jqmWindow .body').animate({ scrollTop: 0 }, 'fast');
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
              name: _.findWhere(profileVariables[loop].controlProperties, { 'uid': 'variablename' }).value,
              id: profileVariables[loop].id,
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
