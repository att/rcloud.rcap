define([
    'rcap/js/utils/rcapLogger',
    'rcap/js/ui/formBuilder',
    'pages/page',
    'text!rcap/partials/dialogs/_addPage.htm',
    'text!rcap/partials/dialogs/_pageSettings.htm',
    'text!rcap/partials/dialogs/_dataSourceSettings.htm',
    'text!rcap/partials/dialogs/_timerSettings.htm',
    'text!rcap/partials/dialogs/_controlSettings.htm',
    'text!rcap/partials/dialogs/_formBuilder.htm',
    'text!rcap/partials/dialogs/_styleEditorDialog.htm',
    'text!rcap/partials/dialogs/_siteSettings.htm',
    'text!rcap/partials/dialogs/_profileSettings.htm',
    'text!rcap/partials/dialogs/_confirmDialog.htm',
    'text!rcap/partials/dialogs/templates/profileVariables.tpl',
    'text!rcap/partials/dialogs/templates/newProfileVariable.tpl',
    'pubsub',
    'site/pubSubTable',
    'rcap/js/ui/dialogUtils',
    'parsley',
    'rcap/js/vendor/jqModal.min'
], function(RcapLogger, FormBuilder, Page, addPagePartial, pageSettingsPartial, dataSourceSettingsPartial,
    timerSettingsPartial, controlSettingsPartial, formBuilderPartial, styleEditorPartial, siteSettingsPartial,
    profileSettingsPartial, confirmDialogPartial, profileVariablesTpl, newProfileVariableTpl, PubSub, pubSubTable, DialogUtils) {

    'use strict';

    var rcapLogger = new RcapLogger();

    var validateControl = function() {
        if (true === $('#control-form').parsley().isValid()) {
            //$('.form-errors').addClass('hidden');

            // get the control that was initially assigned:
            var originatingControl = $('#dialog-controlSettings').data('control');

            // todo: validate
            $.each(originatingControl.controlProperties, function(index, prop) {

                // get the value:
                var dialogValue = prop.getDialogValue();

                // assign:
                originatingControl.controlProperties[index].value = dialogValue;
            });

            $.each(originatingControl.styleProperties, function(index, prop) {
                originatingControl.styleProperties[index].value = prop.getDialogValue();
            });

            // push the updated event:
            originatingControl.isDirty = true;
            PubSub.publish(pubSubTable.updateControl, originatingControl);

            $('#dialog-controlSettings').jqmHide();

            return false;

        } else {
            //$('.form-errors').removeClass('hidden');
        }
    };

    var validatePageSettingsForm = function() {
        if (true === $('#page-form').parsley().isValid()) {

            var page = $('#page-form').data('page');

            // push the updated event:
            PubSub.publish(pubSubTable.updatePage, {
                id: $('#page-form').data('pageid'),
                navigationTitle: $('#inputPageNavigationTitle').val(),
                isEnabled: $('#inputIsEnabled').prop('checked'),
                styleProperties: page.styleProperties
            });

            $('.jqmWindow').jqmHide();

            return false;

        } else {

        }
    };

    var DialogManager = function() {

        this.initialise = function() {

            // append the dialogs to the root of the designer:
            _.each([addPagePartial, pageSettingsPartial, dataSourceSettingsPartial, timerSettingsPartial, controlSettingsPartial, formBuilderPartial, styleEditorPartial, siteSettingsPartial, profileSettingsPartial, confirmDialogPartial], function(partial) {
                $('#rcap-designer').append(partial);
            });

            new DialogUtils().initialise();

            // initialise the form builder dialog:
            var formBuilder = new FormBuilder();
            formBuilder
                .intialiseFormBuilderMenu()
                .initialise();

            // confirmation 'confirm':
            $('body').on('click', '#dialog-confirm .approve', function() {
                var approveData = $(this).data();

                // publish the appropriate message with the data:
                PubSub.publish(approveData.message, approveData.dataitem);

                // and close all dialogs:
                $('.jqmWindow').jqmHide();
            });

            ////////////////////////////////////////////////////////////////////////////////
            //
            // general confirmation dialog:
            //
            PubSub.subscribe(pubSubTable.showConfirmDialog, function(msg, data) {

                rcapLogger.info('dialogManager: pubSubTable.showConfirmDialog');

                // set confirmation dialog properties:
                $('#dialog-confirm h1').text(data.heading);
                $('#dialog-confirm p').text(data.message);

                $('#dialog-confirm .approve').data({
                    message: data.pubSubMessage,
                    dataitem: data.dataItem
                });


                $('#dialog-confirm').jqmShow();
            });

            ////////////////////////////////////////////////////////////////////////////////
            //
            // control configure message subscription:
            //
            PubSub.subscribe(pubSubTable.configureControl, function(msg, control) {

                rcapLogger.info('dialogManager: pubSubTable.configureControl');

                PubSub.publish(control.type === 'form' ? pubSubTable.showFormBuilderDialog : pubSubTable.showControlDialog, control);

            });

            ////////////////////////////////////////////////////////////////////////////////
            //
            // dialog form builder show message subscription:
            //
            PubSub.subscribe(pubSubTable.showFormBuilderDialog, function(msg, control) {

                rcapLogger.info('dialogManager: pubSubTable.showFormBuilderDialog');

                formBuilder.setFormControl(control);

                $('#dialog-form-builder').jqmShow();

                $('#dialog-form-builder .body').hide();
                $('#dialog-form-builder .body:eq(0)').show();

                $('#dialog-form-builder .top-level-tabs a').removeClass('active');
                $('#dialog-form-builder .top-level-tabs a:eq(0)').addClass('active');

                $('#dialog-form-builder .body:eq(1)').height($('#dialog-form-builder .body:eq(0)').height());
            });

            ////////////////////////////////////////////////////////////////////////////////
            //
            // control configure message subscription:
            //
            PubSub.subscribe(pubSubTable.showControlDialog, function(msg, control) {

                rcapLogger.info('dialogManager: pubSubTable.showControlDialog');

                // set the markup and the data object:
                $('#dialog-controlSettings').data('control', control);
                $('#dialog-controlSettings form')
                    .html(control.getDialogMarkup());

                $('#dialog-controlSettings form')
                    .find('input')
                    .keydown(function(e) {
                        if (e.which === 13) { /*console.log(e);*/
                            return false;
                        }
                    });

                $('#dialog-controlSettings').jqmShow();

            });

            $('#dialog-controlSettings .approve').on('click', function() {
                $('#control-form').parsley().validate();
                validateControl();
            });

            $('#dialog-form-builder .top-level-tabs a').on('click', function() {
                $('#dialog-form-builder .body').hide();

                $(this).addClass('active');
                $(this).siblings().removeClass('active');

                var tabToShow = $(this).attr('data-body-id');

                $('#dialog-form-builder .body[data-body-id="' + tabToShow + '"]').show();
            });

            ////////////////////////////////////////////////////////////////////////////////
            //
            // control/form delete message subscription:
            //
            $('body').on('click', '#dialog-controlSettings .delete, #dialog-form-builder .delete', function() {
                PubSub.publish(pubSubTable.showConfirmDialog, {
                    heading: 'Delete control',
                    message: 'Are you sure you want to delete this control?',
                    pubSubMessage: pubSubTable.deleteControlConfirm,
                    // use general selector, applying to both form and 'general' control dialogs:
                    dataItem: $(this).closest('.jqmWindow').data('control').id
                });
            });

            ////////////////////////////////////////////////////////////////////////////////
            //
            // page configure message subscription:
            //
            PubSub.subscribe(pubSubTable.showPageSettingsDialog, function(msg, pageInfo) {

                rcapLogger.info('dialogManager: pubSubTable.showPageSettingsDialog');

                var page = pageInfo.page;

                // get the current page title, excluding THIS one:
                var currentPageTitles =
                    _.without(
                        _.map(pageInfo.currentPageNavigationTitles, function(s) {
                            return s.toUpperCase();
                        }),
                        pageInfo.page.navigationTitle.toUpperCase());

                $('#inputPageNavigationTitle').val(page.navigationTitle);
                $('#inputIsEnabled').prop('checked', page.isEnabled);

                // styling information:
                //$('#page-styling').html(pageInfo.page.getStyleDialogMarkup());

                $('#dialog-pageSettings form')
                    .find('input')
                    .keydown(function(e) {
                        if (e.which === 13) {
                            return false;
                        }
                    });

                // update the details for 'delete page'
                // deregister the event first, otherwise, it'll add another, the result being that
                // it'll fire multiple times:
                if (pageInfo.canDelete) {

                    $('#dialog-pageSettings .jqm-footer .delete').show();

                    $('#dialog-pageSettings .delete').off('click').on('click', function() {
                        PubSub.publish(pubSubTable.showConfirmDialog, {
                            heading: 'Delete ' + page.navigationTitle,
                            message: 'Are you sure you want to delete ' + page.navigationTitle + '?',
                            pubSubMessage: pubSubTable.deletePageConfirm,
                            dataItem: page.id
                        });
                    });
                } else {
                    $('#dialog-pageSettings .jqm-footer .delete').hide();
                }

                $('#page-form').data('pageid', page.id);
                $('#page-form').data('page', page);

                // custom validator:
                // only need to add once
                //if (!window.ParsleyValidator.validators.rcappagenamevalidator) {
                    window.ParsleyValidator.addValidator('rcappagenamevalidator',
                            function(value) {
                                return currentPageTitles.indexOf(value.toUpperCase()) === -1;
                            })
                        .addMessage('en', 'rcappagenamevalidator', 'This page already exists');
                //}

                $('#page-form').parsley().reset();

                $('#dialog-pageSettings').jqmShow();
            });

            ////////////////////////////////////////////////////////////////////////////////
            //
            // data source configure message subscription:
            //

            // page settings:
            $('body').on('click', '.datasource-settings', function() {
                PubSub.publish(pubSubTable.dataSourceSettingsClicked, $(this).closest('li').data('datasourceid'));
            });

            $('#dialog-pageSettings .approve').on('click', function() {
                $('#page-form').parsley().validate();
                validatePageSettingsForm();
            });

            $('body').on('click', '#dialog-dataSourceSettings .delete', function() {
                PubSub.publish(pubSubTable.showConfirmDialog, {
                    heading: 'Delete data source',
                    message: 'Are you sure you want to delete this data source?',
                    pubSubMessage: pubSubTable.deleteDataSourceConfirm,
                    dataItem: $('#datasource-form').data('datasourceid')
                });
            });

            $('#dialog-dataSourceSettings .approve').on('click', function() {
                $('#datasource-form').parsley().validate();

                if (true === $('#datasource-form').parsley().isValid()) {

                    // push the updated event:
                    PubSub.publish(pubSubTable.updateDataSource, {
                        id: $('#datasource-form').data('datasourceid'),
                        code: $('#inputDataSourceFunction').val(),
                        variable: $('#inputDataSourceVariable').val()
                    });

                    $('.jqmWindow').jqmHide();

                    return false;

                } else {

                }

            });


            PubSub.subscribe(pubSubTable.showDataSourceSettingsDialog, function(msg, dataSource) {

                rcapLogger.info('dialogManager: pubSubTable.showDataSourceSettingsDialog');

                $('#datasource-form').data('datasourceid', dataSource.id);

                $('#inputDataSourceFunction').val(dataSource.code);
                $('#inputDataSourceVariable').val(dataSource.variable);

                $('#inputDataSourceFunction').autocomplete({
                    source: function(request, response) {
                        response(window.RCAP.getRFunctions());
                    }
                });

                $('#dialog-dataSourceSettings').jqmShow();
            });

            ////////////////////////////////////////////////////////////////////////////////
            //
            // timer configure message subscription:
            //
            $('body').on('click', '.timer-settings', function() {
                PubSub.publish(pubSubTable.timerSettingsClicked, $(this).closest('li').data('timerid'));
            });

            $('body').on('click', '#dialog-timerSettings .delete', function() {
                PubSub.publish(pubSubTable.showConfirmDialog, {
                    heading: 'Delete timer',
                    message: 'Are you sure you want to delete this timer?',
                    pubSubMessage: pubSubTable.deleteTimerConfirm,
                    dataItem: $('#timer-form').data('timerid')
                });
            });

            $('#dialog-timerSettings .approve').on('click', function() {
                $('#timer-form').parsley().validate();

                if (true === $('#timer-form').parsley().isValid()) {

                    // push the updated event:
                    PubSub.publish(pubSubTable.updateTimer, {
                        id: $('#timer-form').data('timerid'),
                        variable: $('#inputTimerVariable').val(),
                        interval: $('#inputTimerInterval').val()
                    });

                    $('.jqmWindow').jqmHide();

                    return false;

                } else {

                }
            });

            PubSub.subscribe(pubSubTable.showTimerSettingsDialog, function(msg, timer) {

                console.info('dialogManager: pubSubTable.showTimerSettingsDialog');

                $('#timer-form').data('timerid', timer.id);

                $('#inputTimerVariable').val(timer.variable);
                $('#inputTimerInterval').val(timer.interval);

                $('#inputTimerVariable').autocomplete({
                    source: function(request, response) {
                        response(window.RCAP.getRFunctions());
                    }
                });

                $('#dialog-timerSettings').jqmShow();
            });


            ////////////////////////////////////////////////////////////////////////////////
            //
            // theme editor:
            //
            var getStyleEditor = function() {
                return window.ace.edit('rcap-style-editor');
            };

            PubSub.subscribe(pubSubTable.showThemeEditorDialog, function(msg, themeContent) {

                rcapLogger.info('dialogManager: pubSubTable.showThemeEditorDialog');
                //rcapLogger.log(themeContent);

                var editor = getStyleEditor();

                editor.getSession().setMode('ace/mode/css');
                editor.setOptions({
                    minLines: 1,
                    maxLines: 5000
                });

                editor.setValue(themeContent);   // jshint ignore:line

                $('#dialog-styleSettings').jqmShow();
            });

            $('#dialog-styleSettings .approve').on('click', function() {
                // push the updated event:
                PubSub.publish(pubSubTable.updateTheme, getStyleEditor().getValue());  // jshint ignore:line
                $('.jqmWindow').jqmHide();
                return false;
            });

            ////////////////////////////////////////////////////////////////////////////////
            //
            // site settings:
            //
            PubSub.subscribe(pubSubTable.showSiteSettingsDialog, function(msg, settings) {

                rcapLogger.info('dialogManager: pubSubTable.showSiteSettingsDialog');

                // set the markup and the data object:
                $('#dialog-controlSettings').data('settings', settings);

                // $('#dialog-siteSettings form')
                //     .find('input')
                //     .keydown(function(e) {
                //         if (e.which === 13) { /*console.log(e);*/
                //             return false;
                //         }
                //     });

                var html = '';

                $.each(settings.properties, function(key, prop) {
                    html += prop.render(key);
                });

                $('#dialog-siteSettings form').html(html);

                $('#dialog-siteSettings').jqmShow();
            });

            $('#dialog-siteSettings .approve').on('click', function() {

                if (true === $('#site-form').parsley().isValid()) {
                    // get the control that was initially assigned:
                    var settings = $('#dialog-controlSettings').data('settings');

                    var originalSettings = settings.extract();

                    // todo: validate
                    $.each(settings.properties, function(index, prop) {

                        // get the value:
                        var dialogValue = prop.getDialogValue();

                        // assign:
                        settings.properties[index].value = dialogValue;
                    });

                    var newSettings = settings.extract();

                    // publish updated so site can pick it up
                    PubSub.publish(pubSubTable.updateSiteSettings, settings);

                    PubSub.publish(pubSubTable.updatePageClassSetting, {
                        previous: originalSettings.pageClass,
                        new: newSettings.pageClass
                    });

                    PubSub.publish(pubSubTable.updateSiteThemePackage, newSettings.siteThemePackage);

                    $('.jqmWindow').jqmHide();
                    return false;
                }

            });

            ////////////////////////////////////////////////////////////////////////////////
            //
            // profile settings:
            //
            var addProfileVariableRow = function(focus) {
              $('#dialog-profileSettings tbody tr input').removeAttr('data-last');
              var newRow = $(newProfileVariableTpl);
              $('#dialog-profileSettings tbody').append(newRow);

              newRow.find('[data-autocomplete]').autocomplete({
                  source: function(request, response) {
                      response(window.RCAP.getRFunctions());
                  }
              });

              newRow.fadeIn(function() {
                if(focus) {
                  newRow.find('input:eq(0)').focus();
                }
              });
            };

            PubSub.subscribe(pubSubTable.showProfileDialog, function(msg, profileVariables) {

                rcapLogger.info('dialogManager: pubSubTable.showProfileDialog');

                var template = _.template(profileVariablesTpl);

                var html = (template({
                  profileVariables: profileVariables
                }));

                $('#dialog-profileSettings form').html(html);

                $('#dialog-profileSettings form input[data-autocomplete]').autocomplete({
                    source: function(request, response) {
                        response(window.RCAP.getRFunctions());
                    }
                });

                $('#dialog-profileSettings').jqmShow();

                // add an initial row:
                addProfileVariableRow(true);
            });

            // initialise events:
            $('#dialog-profileSettings').on('keypress', 'input', function(e) {

              if($(e.target).attr('data-last')) {
                addProfileVariableRow();
              }
            });

            $('#dialog-profileSettings').on('click', '.remove-row', function() {
              // remove the row, and if it's the last one, add a new 'last one':
              var row = $(this).closest('tr');
              if(row.find('input[data-last]').length) {
                addProfileVariableRow(true);
              } else {
                // get the next row and focus the first:
                row.next().find('input:eq(0)').focus();
              }

              row.remove();
            });

            $('#dialog-profileSettings .approve').on('click', function() {
              // push the updated details:
              var profileVariables = [];

              $('#dialog-profileSettings tbody tr').each(function() {

                // only interested with rows where all info has been filled in:
                if($($(this).find('input')).filter(function() { return $(this).val(); }).length === 3){
                  var profileVariable = {
                    type: 'profileVariable',
                    id: Math.random().toString(16).slice(2),
                    controlProperties: []
                  };

                  $.each($(this).find('input'), function(index, item) {
                    profileVariable.controlProperties.push({
                      uid: ['variablename', 'code', 'description'][index],
                      value: $(item).val(),
                      id: Math.random().toString(16).slice(2)
                    });

                  });

                  profileVariables.push(profileVariable);
                }
              });

              PubSub.publish(pubSubTable.updateProfile, profileVariables);

              $('.jqmWindow').jqmHide();
            });
        };
    };

    return DialogManager;
});
