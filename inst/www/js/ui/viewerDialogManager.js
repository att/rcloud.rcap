define([
  'pubsub',
  'site/pubSubTable',
  'rcap/js/ui/dialogUtils',
  'text!rcap/partials/dialogs/_viewerProfileSettings.htm',
  'text!rcap/partials/dialogs/_viewerDataUpload.htm',
  'text!rcap/partials/dialogs/_confirmDialog.htm',
  'text!rcap/partials/dialogs/templates/viewerProfileVariables.tpl',
  'text!rcap/partials/dialogs/templates/viewerDataUpload.tpl',
  'site/profileVariableManager',
  'parsley'
], function (PubSub, pubSubTable, DialogUtils, configuratorPartial, dataUploadPartial, confirmDialogPartial, 
  viewerProfileVariablesTpl, viewerDataUploadTpl, ProfileVariableManager) {

  'use strict';

  var profileManager = new ProfileVariableManager();

  var ViewerDialogManager = Class.extend({
    initialise: function () {

      // configure the configurator dialog:
      // #dialog-viewerProfileSettings
      $('#rcap-viewer').append(configuratorPartial);
      $('#rcap-viewer').append(dataUploadPartial);
      $('#rcap-viewer').append(confirmDialogPartial);

      new DialogUtils().initialise();

          window.Parsley
            .addValidator('allowedfileext', {
              requirementType: 'string',
              validateString: function(value, requirement, parsleyInstance) {
                var file = parsleyInstance.$element[0].files;
                if (file.length === 0) {
                    return true;
                }
                return requirement.length === 0 || 
                ( file.length === 1 && 
                requirement.split(',').indexOf(file[0].name.slice((Math.max(0, file[0].name.lastIndexOf('.')) || Infinity) + 1))>=0);
              },
              messages: {
                en: 'Invalid file type, only: %s files are allowed.'
              }
            });
      
            ////////////////////////////////////////////////////////////////////////////////
            //
            // general confirmation dialog:
            //
            PubSub.subscribe(pubSubTable.showConfirmDialog, function(msg, data) {
                $('#dialog-confirm .jqmClose').off('click');
                $('#dialog-confirm .approve').off('click');
                
                $('#dialog-confirm .approve').on('click', function() {
                    var approveData = $(this).data();
    
                    // publish the appropriate message with the data:
                    PubSub.publish(approveData.message, approveData.dataitem);
    
                    // and close all dialogs:
                    $('#dialog-confirm').jqmHide();
                });
                
                $('#dialog-confirm .jqmClose').on('click', function() {
                    var cancelData = $(this).data();
    
                    if(cancelData.message) {
                      // publish the appropriate message with the data:
                      PubSub.publish(cancelData.message, cancelData.dataitem);
                    }
                    $('#dialog-confirm').jqmHide();
                });
                // set confirmation dialog properties:
                $('#dialog-confirm h1').text(data.heading);
                $('#dialog-confirm p').text(data.message);

                $('#dialog-confirm .approve').data({
                    message: data.pubSubMessage,
                    dataitem: data.dataItem
                });

                if(data.cancelData) {
                  $('#dialog-confirm .jqmClose').data({
                      message: data.cancelData.pubSubMessage,
                      dataitem: data.cancelData.dataItem
                  });
                } else {
                  $('#dialog-confirm .jqmClose').removeData([ 'message', 'dataitem' ]);
                }
                $('#dialog-confirm').jqmShow();
            });
      ////////////////////////////////////////////////////////////////////////////////
      //
      // viewer profile settings:
      //
      $('#dialog-viewerProfileSettings').on('change', '.selection-method select', function() {
        var tr = $(this).closest('tr');
        tr.find('[data-selectionmethod]').hide();
        tr.find('[data-selectionmethod="' + $(this).val() + '"]').show();

        if($(this).val() === 'all') {
          tr.find('select[multiple]')
            .removeAttr('data-parsley-required')
            .parsley('destroy');
        } else {
          tr.find('select[multiple]')
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

            // only update if there's something to update:
            if(data.updatedVariables.length) {
              profileManager.updateProfileVariables(data);
            }

            $('.jqmWindow').jqmHide();
          } else {
            $('#dialog-viewerProfileSettings .jqmWindow .body').animate({ scrollTop: 0 }, 'fast');
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
              $(tr).find('select[multiple]')
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

          $('#dialog-viewerProfileSettings .jqmWindow .body').animate({ scrollTop: 0 }, 'fast');
          $('#dialog-viewerProfileSettings').jqmShow();
        };

        profileManager.getProfileVariableData(profileVariables).then(function(profileDataItems) {
          initViewerProfileDialog(profileDataItems);
        });
      });

      ////////////////////////////////////////////////////////////////////////////////
      //
      // viewer file upload:
      //
      PubSub.subscribe(pubSubTable.showDataUploadDialog, function (msg, options) {
        
          var template = _.template(viewerDataUploadTpl);

          var html = (template({}));
          $('#upload-form').html(html);
          $('#upload-form').data('variableName', options.variablename);
          $('#upload-form').data('id', options.controlId);
          $('#dialog-viewerDataUpload').jqmShow();
            if(options.allowedtypes && options.allowedtypes.length > 0) {
              $('#file-upload-file').attr('data-parsley-allowedfileext', options.allowedtypes);
            }
      });

      $('#dialog-viewerDataUpload .approve').on('click', function() {

          $('#upload-form').parsley().validate();
          
          if ($('#upload-form').parsley().isValid()) {
            var file = $('#file-upload-file');
            var uploadTask = {
                   'variableName': $('#upload-form').data('variableName'), 
                   'datasetName': $('#datasetName').val(), 
                   'description' : $('#description').val(), 
                   'file' : file
            };
            var callbacks = {
                          start: function(filename) { // jshint ignore:line
                                $('#progress').show();
                                $('#progress-bar').css('width', '0%');
                                $('#progress-bar').attr('aria-valuenow', '0');
                          },
                          progress: function(read, size) {
                                $('#progress-bar').attr('aria-valuenow', ~~(100 * (read / size))); // jshint ignore:line
                                $('#progress-bar').css('width', (100 * (read / size)) + '%');
                          },
                          done: function(isReplace, filename) {
                              var data = { updatedVariables : []};
                              data.updatedVariables.push(
                                {
                                  controlId : $('#upload-form').data('id'),
                                  value : { 
                                    'uploaded.file.name' : filename,
                                    'uploaded.file.description' : uploadTask.description,
                                    'uploaded.file.datasetName' : uploadTask.datasetName
                                  }
                                }
                              );
                              window.RCAP.updateControls(JSON.stringify(data));
                              $('.jqmWindow').jqmHide();
                          },
                          confirm_replace: Promise.promisify(function(filename, callback) { // jshint ignore:line
                                PubSub.publish(pubSubTable.showConfirmDialog, {
                                    heading: 'Replace dataset?',
                                    message: 'File in specified dataset already exists. Do you want to replace it?',
                                    pubSubMessage: pubSubTable.overwriteDataUploadConfirm,
                                    // use general selector, applying to both form and 'general' control dialogs:
                                    dataItem:  { callback : callback, overwrite: true},
                                    cancelData:  {
                                      pubSubMessage : pubSubTable.overwriteDataUploadConfirm,
                                      dataItem:  { callback : callback, overwrite: false}
                                    }
                                });
                          })
              
            };
            window.RCAP.uploadData(uploadTask, callbacks);
          } else {
            $('#dialog-viewerDataUpload .jqmWindow .body').animate({ scrollTop: 0 }, 'fast');
          }
      });
      
      PubSub.subscribe(pubSubTable.overwriteDataUploadConfirm, function(msg, options) {
        if(options.callback) {
          options.callback(null, options.overwrite);
        }
      });

    }
  });

  return ViewerDialogManager;
});
