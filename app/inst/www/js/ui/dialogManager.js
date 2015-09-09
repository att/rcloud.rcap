define([
    'rcap/js/ui/menuManager',
    'rcap/js/ui/formBuilder',
    'text!rcap/partials/dialogs/_addPage.htm',
    'text!rcap/partials/dialogs/_pageSettings.htm',
    'text!rcap/partials/dialogs/_rPlotSettings.htm',
    'text!rcap/partials/dialogs/_siteSettings.htm',
    'text!rcap/partials/dialogs/_controlSettings.htm',
    'text!rcap/partials/dialogs/_formBuilder.htm',
    'pubsub',
    'parsley',
    'rcap/js/vendor/jqModal.min'
], function(MenuManager, FormBuilder, addPagePartial, pageSettingsPartial, rPlotSettingsPartial, siteSettingsPartial, controlSettingsPartial, formBuilderPartial, PubSub) {

    'use strict';

    //console.log(parsley);

    return {
        initialise: function() {

            // append the dialogs to the root of the designer:
            _.each([addPagePartial, pageSettingsPartial, rPlotSettingsPartial, siteSettingsPartial, controlSettingsPartial, formBuilderPartial], function(partial) {
                $('#rcap-designer').append(partial);
            });

            // initialise each of the dialogs:
            $('.jqmWindow').each(function() {
                $(this).jqm();
            });

            // initialise the form builder dialog:
            var menuManager = new MenuManager();
            menuManager.intialiseFormBuilderMenu();
            var formBuilder = new FormBuilder();
            formBuilder.initialise();

            // general jqm handler:
            $('body').on('click', '.jqm', function() {
                $($(this).data('jqm')).jqmShow();
            });

            ////////////////////////////////////////////////////////////////////////////////
            //
            // control configure message subscription:
            //
            PubSub.subscribe('control:configure', function(msg, control) {

                PubSub.publish( control.type === 'form' ? 'formBuilderDialog:show' : 'controlDialog:show', control);

            });

            ////////////////////////////////////////////////////////////////////////////////
            //
            // dialog form builder show message subscription:
            //
            PubSub.subscribe('formBuilderDialog:show', function(msg, control) {

                formBuilder.setFormControl(control);

                $('#dialog-form-builder').jqmShow();

            });

            ////////////////////////////////////////////////////////////////////////////////
            //
            // control configure message subscription:
            //
            PubSub.subscribe('controlDialog:show', function(msg, control) {

                // set the markup and the data object:
                $('#dialog-controlSettings form')
                    .html(control.getDialogMarkup())
                    .data('control', control)
                    .keydown(function(e) { if( e.which === 13) { return false; }});

                // initialise validation:
                //$('#dialog-controlSettings form').parsley();

                // $.listen('parsley:field:validate', function () {
                //   validate();
                // });

                //   $('#demo-form .btn').on('click', function () {
                $('#dialog-controlSettings .approve').on('click', function() {
                    $('#control-form').parsley().validate();
                    validate();
                });

                var validate = function() {
                    if (true === $('#control-form').parsley().isValid()) {
                        //$('.form-errors').addClass('hidden');

                        // get the control that was initially assigned:
                        var originatingControl = $('#dialog-controlSettings form').data('control');

                        // todo: validate
                        $.each(originatingControl.controlProperties, function(index, prop) {

                            // get the value:
                            var dialogValue = prop.getDialogValue();

                            // validate:

                            // assign:

                            originatingControl.controlProperties[index].value = dialogValue;
                        });

                        // push the updated event:
                        PubSub.publish('controlDialog:updated', originatingControl);

                        $('#dialog-controlSettings').jqmHide();

                        return false;

                    } else {
                        //$('.form-errors').removeClass('hidden');
                    }
                };

                $('#dialog-controlSettings').jqmShow();

            });

        }
    };
});
