define([
    'text!rcap/partials/dialogs/_addPage.htm',
    'text!rcap/partials/dialogs/_pageSettings.htm',
    'text!rcap/partials/dialogs/_rPlotSettings.htm',
    'text!rcap/partials/dialogs/_siteSettings.htm',
    'rcap/js/vendor/jqModal.min'
], function(addPagePartial, pageSettingsPartial, rPlotSettingsPartial, siteSettingsPartial) {

    'use strict';

    return {
        initialise: function() {

            // append the dialogs to the root of the designer:
            $('#rcap-designer').append(addPagePartial);
            $('#rcap-designer').append(pageSettingsPartial);
            $('#rcap-designer').append(rPlotSettingsPartial);
            $('#rcap-designer').append(siteSettingsPartial);

            // initialise each of the dialogs:
            $('.jqmWindow').each(function() {
                $(this).jqm();
            });

            //$('#dialog-pageSettings, #dialog-rPlotSettings, #dialog-addPage, #dialog-siteSettings').jqm();

            $('body').on('click', '.menu .page-settings', function() {
                $('#dialog-pageSettings').jqmShow();
            });

            $('body').on('click', '.menu #controls a', function() {
                $('#dialog-rPlotSettings').jqmShow();
            });

            $('body').on('click', '.menu #pages a.add-page, .menu #pages span.page-add', function() {
                $('#dialog-addPage').jqmShow();
            });

            $('body').on('click', '.menu #settings a', function() {
                $('#dialog-siteSettings').jqmShow();
            });

        }
    };
});
