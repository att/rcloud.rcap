define([
    'rcap/js/ui/menuManager',
    'rcap/js/ui/formBuilder',
    'text!rcap/partials/dialogs/_addPage.htm',
    'text!rcap/partials/dialogs/_pageSettings.htm',
    'text!rcap/partials/dialogs/_siteSettings.htm',
    'text!rcap/partials/dialogs/_controlSettings.htm',
    'text!rcap/partials/dialogs/_formBuilder.htm',
    'text!rcap/partials/dialogs/_confirmDialog.htm',
    'pubsub',
    'site/pubSubTable',
    'parsley',
    'rcap/js/vendor/jqModal.min'
], function(MenuManager, FormBuilder, addPagePartial, pageSettingsPartial, siteSettingsPartial, controlSettingsPartial, formBuilderPartial, confirmDialogPartial, PubSub, pubSubTable) {

    'use strict';

    //console.log(parsley);

    return {
        initialise: function() {

            // append the dialogs to the root of the designer:
            _.each([addPagePartial, pageSettingsPartial, siteSettingsPartial, controlSettingsPartial, formBuilderPartial, confirmDialogPartial], function(partial) {
                $('#rcap-designer').append(partial);
            });

            // initialise each of the dialogs:
            $('.jqmWindow').each(function() {
                $(this).jqm({
                    modal: true
                });
            });

            // initialise the form builder dialog:
            var menuManager = new MenuManager();
            menuManager.intialiseFormBuilderMenu();
            var formBuilder = new FormBuilder();
            formBuilder.initialise();

            // general jqm handler:
            // $('body').on('click', '.jqm', function() {
            //     $($(this).data('jqm')).jqmShow();
            // });

            // page settings:
            $('body').on('click', '.page-settings', function() {
                PubSub.publish(pubSubTable.pageSettingsClicked, $(this).closest('li').data('pageid'));
            });

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

                console.info('dialogManager: pubSubTable.showConfirmDialog');

                // set confirmation dialog properties:
                $('#dialog-confirm h1').text(data.heading);
                $('#dialog-confirm p').text(data.message);
                $('#dialog-confirm .approve').attr({
                    'data-message': data.pubSubMessage,
                    'data-dataitem': data.dataItem
                });

                $('#dialog-confirm').jqmShow();
            });

            ////////////////////////////////////////////////////////////////////////////////
            //
            // control configure message subscription:
            //
            PubSub.subscribe(pubSubTable.configureControl, function(msg, control) {

                console.info('dialogManager: pubSubTable.configureControl');

                PubSub.publish(control.type === 'form' ? pubSubTable.showFormBuilderDialog : pubSubTable.showControlDialog, control);

            });

            ////////////////////////////////////////////////////////////////////////////////
            //
            // dialog form builder show message subscription:
            //
            PubSub.subscribe(pubSubTable.showFormBuilderDialog, function(msg, control) {

                console.info('dialogManager: pubSubTable.showFormBuilderDialog');

                formBuilder.setFormControl(control);

                $('#dialog-form-builder').jqmShow();

            });

            ////////////////////////////////////////////////////////////////////////////////
            //
            // control configure message subscription:
            //
            PubSub.subscribe(pubSubTable.showControlDialog, function(msg, control) {

                console.info('dialogManager: pubSubTable.showControlDialog');

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

                // initialise validation:
                //$('#dialog-controlSettings form').parsley();

                // $.listen('parsley:field:validate', function () {
                //   validate();
                // });

                //   $('#demo-form .btn').on('click', function () {
                $('#dialog-controlSettings .approve').off('click').on('click', function() {
                    $('#control-form').parsley().validate();
                    validate();
                });

                var validate = function() {
                    if (true === $('#control-form').parsley().isValid()) {
                        //$('.form-errors').addClass('hidden');

                        // get the control that was initially assigned:
                        var originatingControl = $('#dialog-controlSettings').data('control');

                        // todo: validate
                        $.each(originatingControl.controlProperties, function(index, prop) {

                            // get the value:
                            var dialogValue = prop.getDialogValue();

                            // validate:

                            // assign:

                            originatingControl.controlProperties[index].value = dialogValue;
                        });

                        // push the updated event:
                        PubSub.publish(pubSubTable.updateControl, originatingControl);

                        $('#dialog-controlSettings').jqmHide();

                        return false;

                    } else {
                        //$('.form-errors').removeClass('hidden');
                    }
                };

                $('#dialog-controlSettings').jqmShow();

            });

            ////////////////////////////////////////////////////////////////////////////////
            //
            // control/form delete message subscription:
            //
            $('body').off('click').on('click', '#dialog-controlSettings .delete, #dialog-form-builder .delete', function() {
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
            // control configure message subscription:
            //
            PubSub.subscribe(pubSubTable.showPageSettingsDialog, function(msg, page) {

                console.info('dialogManager: pubSubTable.showPageSettingsDialog');

                // show the settings dialog:

                $('#inputPageNavigationTitle').val(page.navigationTitle);
                //$('#inputPageTitle').val(page.pageTitle);
                //$('#inputPageUrlSlug').val(page.urlSlug);

                $('#dialog-pageSettings form')
                    .find('input')
                    .keydown(function(e) {
                        if (e.which === 13) {
                            return false;
                        }
                    });

                $('#dialog-pageSettings .approve').off('click').on('click', function() {
                    $('#page-form').parsley().validate();
                    validate();
                });

                // update the details for 'delete button':
                $('#dialog-pageSettings .delete').off('click').on('click', function() {
                    PubSub.publish(pubSubTable.showConfirmDialog, {
                        heading: 'Delete ' + page.navigationTitle,
                        message: 'Are you sure you want to delete ' + page.navigationTitle + '?',
                        pubSubMessage: pubSubTable.deletePageConfirm,
                        dataItem: page.id
                    });
                });

                var validate = function() {
                    if (true === $('#page-form').parsley().isValid()) {

                        // push the updated event:
                        PubSub.publish(pubSubTable.updatePage, {
                            id: $('#page-form').data('pageid'),
                            navigationTitle: $('#inputPageNavigationTitle').val(),
                            // title : $('#inputPageTitle').val(),
                            // urlSlug : $('#inputPageUrlSlug').val()
                        });

                        $('#dialog-controlSettings').jqmHide();

                        return false;

                    } else {
                        //$('.form-errors').removeClass('hidden');
                    }
                };


                $('#page-form').data('pageid', page.id);
                $('#dialog-pageSettings').jqmShow();
            });

        }
    };
});
