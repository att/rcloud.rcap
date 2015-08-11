define([
    'text!rcap/partials/dialogs/_addPage.htm',
    'text!rcap/partials/dialogs/_pageSettings.htm',
    'text!rcap/partials/dialogs/_rPlotSettings.htm',
    'text!rcap/partials/dialogs/_siteSettings.htm',
    'text!rcap/partials/dialogs/_controlSettings.htm',
    'rcap/js/vendor/jqModal.min'
], function(addPagePartial, pageSettingsPartial, rPlotSettingsPartial, siteSettingsPartial, controlSettingsPartial) {

    'use strict';

    return {
        initialise: function() {

            // append the dialogs to the root of the designer:
            _.each([addPagePartial, pageSettingsPartial, rPlotSettingsPartial, siteSettingsPartial, controlSettingsPartial], function(partial) {
                $('#rcap-designer').append(partial);
            });

            // initialise each of the dialogs:
            $('.jqmWindow').each(function() {
                $(this).jqm();
            });

            // general jqm handler:
            $('body').on('click', '.jqm', function() {
                $($(this).data('jqm')).jqmShow();
            });

            // configuration:
            $('body').on('click', '#inner-stage .configure button', function() {

                function initialiseControlDialog(control) {

                    // set the markup and the data object:
                    $('#dialog-controlSettings .body')
                        .html(control.getDialogMarkup())
                        .data('control', control);
                }

                initialiseControlDialog($(this).closest('.grid-stack-item').data('control'));
                $('#dialog-controlSettings').jqmShow();
                
            });

            // MODIFY CONTROL APPROVE:
            $('body').on('click', '#dialog-controlSettings .approve', function() {

                // get the control that was initially assigned:
                var originatingControl = $('#dialog-controlSettings .body').data('control');

                // todo: validate
                $.each(originatingControl.controlProperties, function(index, prop) {

                    // get the value:
                    var dialogValue = prop.getDialogValue();

                    // validate:

                    // assign:

                    originatingControl.controlProperties[index].value = dialogValue;
                });

                $('.grid-stack[data-controlid="' + originatingControl.id + '"]').data('control', originatingControl);

                $('#dialog-controlSettings').jqmHide(); 
            });

        }
    };
});
