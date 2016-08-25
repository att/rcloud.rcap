define(['rcap/js/ui/controls/gridControl',
    'rcap/js/ui/controls/properties/textControlProperty',
    'utils/variableHandler',
    'text!controlTemplates/actionButton.tpl'
], function(GridControl, TextControlProperty, variableHandler, tpl) {

    'use strict';

    var RPlotControl = GridControl.extend({
        init: function() {
            this._super({
                type: 'actionbutton',
                controlCategory: 'Dynamic',
                label: 'Action Button',
                icon: 'exclamation-sign',
                initialSize: [2, 2],
                controlProperties: [
                    new TextControlProperty({
                        uid: 'variablename',
                        label: 'Variable',
                        helpText: 'The variable associated with this control',
                        isRequired: true
                    }),
                    new TextControlProperty({
                        uid: 'buttonText',
                        label : 'Button Text',
                        defaultValue : '',
                        helpText : 'Button Text',
                        isRequired: true,
                        isHorizontal: false
                    })
                ]
            });
        },
        getVariableData: function() {

        },
        render: function() {

            var template = _.template(tpl);

            return template({
                control: this
            });

        },
        initialiseViewerItems: function() {

            $('[data-controltype="actionbutton"]').click(function() {
                variableHandler.submitChange({
                    variableName: $(this).attr('data-variablename'),
                    controlId: $(this).attr('id'),
                    value: Math.random().toString(16).slice(2).substring(0, 6)
                });
            });
        }
    });

    return RPlotControl;


});
