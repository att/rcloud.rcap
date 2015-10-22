define([
    'rcap/js/ui/formBuilder',
    'pages/page',
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
], function(FormBuilder, Page, addPagePartial, pageSettingsPartial, siteSettingsPartial, controlSettingsPartial, formBuilderPartial, confirmDialogPartial, PubSub, pubSubTable) {

    'use strict';

    var validateControl = function() {
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

            $.each(originatingControl.styleProperties, function(index, prop) {
                originatingControl.styleProperties[index].value = prop.getDialogValue();
            });

            /*
                        // get style properties:
                        originatingControl.styleProperties.padding = $('#' + originatingControl.id + '-padding').slider('option', 'value');
                        originatingControl.styleProperties.borderWidth = $('#' + originatingControl.id + '-borderWidth').slider('option', 'value');

                        var bgColor = $('#' + originatingControl.id + '-backgroundColor').spectrum('get');
                        var borderColor = $('#' + originatingControl.id + '-borderColor').spectrum('get');

                        originatingControl.styleProperties.backgroundColor = bgColor ? bgColor.toHexString() : undefined;
                        originatingControl.styleProperties.borderColor = borderColor ? borderColor.toHexString() : undefined;
            */

            // push the updated event:
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

            $.each(page.styleProperties, function(index, prop) {
                page.styleProperties[index].value = prop.getDialogValue();
            });

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
            var formBuilder = new FormBuilder();
            formBuilder
                .intialiseFormBuilderMenu()
                .initialise();

            // page settings:
            $('body').on('click', '.page-settings', function() {
                PubSub.publish(pubSubTable.pageSettingsClicked, $(this).closest('li').data('pageid'));
            });

            // duplicate page:
            $('body').on('click', '.page-duplicate', function() {
                // show confirmation:
                PubSub.publish(pubSubTable.showConfirmDialog, {
                    heading: 'Duplicate Page?',
                    message: 'Are you sure you wish to duplicate this page?',
                    pubSubMessage: pubSubTable.duplicatePageConfirm,
                    dataItem: $(this).closest('li').data('pageid')
                });
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
                // $('#dialog-confirm .approve').attr({
                //     'data-message': data.pubSubMessage,
                //     'data-dataitem': data.dataItem
                // });

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
            // control configure message subscription:
            //
            PubSub.subscribe(pubSubTable.showPageSettingsDialog, function(msg, pageInfo) {

                console.info('dialogManager: pubSubTable.showPageSettingsDialog');

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
                $('#page-styling').html(pageInfo.page.getStyleDialogMarkup());

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
                if (!window.ParsleyValidator.validators.rcappagenamevalidator) {
                    window.ParsleyValidator.addValidator('rcappagenamevalidator',
                            function(value) {
                                return currentPageTitles.indexOf(value.toUpperCase()) === -1;
                            })
                        .addMessage('en', 'rcappagenamevalidator', 'This page already exists');
                }

                $('#dialog-pageSettings').jqmShow();
            });

            $('#dialog-pageSettings .approve').on('click', function() {
                $('#page-form').parsley().validate();
                validatePageSettingsForm();
            });

        };
    };

    return DialogManager;
});
