define(['rcap/js/ui/controls/gridControl',
    'rcap/js/ui/controls/properties/textControlProperty',
    'rcap/js/ui/controls/properties/autocompleteControlProperty',
    'text!controlTemplates/rPlot.tpl',
    'text!controlTemplates/rPlot-design.tpl'
], function(GridControl, TextControlProperty, AutocompleteControlProperty, tpl, dtpl) {

    'use strict';

    var RPlotControl = GridControl.extend({
        init: function() {
            this._super({
                type: 'rplot',
                label: 'R Plot',
                icon: 'signal',
                initialSize: [2, 2],
                controlProperties: [
                    new AutocompleteControlProperty({
                        uid: 'code',
                        label: 'R Function',
                        helpText: 'R Function for this control.',
                        isRequired: true
                    })
                ]
            });
        },
        render: function(options) {

            options = options || {};
            var isDesignTime = options.isDesignTime || false;

            var template = isDesignTime ? _.template(dtpl) : _.template(tpl);

            return template({
                control: this
            });

        },
        initialiseViewerItems: function() {

            /*
            $('.grid-stack-item-content.rcap-controltype-rplot').click(function() {
                //$('#rcap-stretcher .js-rcap-dynamic').append($('<img />').attr('src', $(this).find('img').attr('src')));

                // var copy = $(this).find('.live-plot').clone(true);
                // $(copy).find('.ui-resizable-handle').remove();
                // $(copy).resizable();

                $(this).find('.live-plot').clone(true).appendTo('#rcap-stretcher .js-rcap-dynamic');

                //$('#rcap-stretcher .js-rcap-dynamic').append($('<img />').attr('src', $(this).find('img').attr('src')));

                $('body').addClass('rcap-stretched');
                $('#rcap-stretcher').show();

                $('#rcap-stretcher img').resizable({ aspectRatio: true, maxHeight: $('#rcap-stretcher img').height() });
            });

            $('#rcap-stretcher .stretcher-close').click(function() {
                $('#rcap-stretcher .js-rcap-dynamic').children().remove();
                $('body').removeClass('rcap-stretched');
                $('#rcap-stretcher').hide();
            });
*/



/*
            var notebookResult = window.notebook_result; // jshint ignore:line

            // some controls are dependent on having a valid notebook result:
            if (notebookResult) {

                $('.rplot').each(function(i, e) {
                    if (typeof notebookResult[$(e).attr('id')] === 'function') {
                        var $enclosingDiv = $(e).closest('.grid-stack-item-content');

                        notebookResult[$(e).attr('id')]({
                            width: $enclosingDiv.width() * 1.0,
                            height: $enclosingDiv.height() * 1.0
                        }, function() {});

                    } else {
                        $(e).text('the function ' + $(e).attr('id') + '() does not exist...');
                        $(e).closest('.grid-stack-item-content').css({
                                'color': 'red',
                                'font-weight': 'bold',
                                'border': '1px solid red'
                            });
                    }
                });
            }
*/

        }
    });

    return RPlotControl;


});
