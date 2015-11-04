define(['rcap/js/ui/controls/gridControl',
    'rcap/js/ui/controls/properties/textControlProperty',
    'rcap/js/ui/controls/properties/autocompleteControlProperty',
    'text!controlTemplates/interactivePlot.tpl',
    'text!controlTemplates/interactivePlot-design.tpl'
], function(GridControl, TextControlProperty, AutocompleteControlProperty, tpl, dtpl) {

    'use strict';

    var InteractivePlotControl = GridControl.extend({
        init: function() {
            this._super({
                type: 'interactiveplot',
                label: 'Interactive Plot',
                icon: 'bar-chart',
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

            var notebookResult = window.notebook_result; // jshint ignore:line

            // some controls are dependent on having a valid notebook result:
            if (notebookResult) {

                $('.rplot').each(function(i, e) {
                    if (typeof notebookResult[$(e).attr('id')] === 'function') {
                        var $enclosingDiv = $(e).closest('.grid-stack-item-content');

                        notebookResult[$(e).attr('id')]({
                            width: $enclosingDiv.width() * 1.5,
                            height: $enclosingDiv.height() * 1.5
                        }, function() {});

                    } else {
                        $(e).css({
                                'color': 'red',
                                'font-weight': 'bold',
                                'border': '1px solid red'
                            })
                            .text('the function ' + $(e).attr('id') + '() does not exist...');
                    }
                });
            }

        }
    });

    return InteractivePlotControl;

});
