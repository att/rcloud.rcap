define(['rcap/js/ui/controls/baseControl',
	'rcap/js/ui/controls/properties/textControlProperty',
	'rcap/js/ui/controls/properties/multilineTextControlProperty',
    'text!rcap/js/ui/controls/child/templates/radioButtonGroup.tpl'//,
    //'text!rcap/js/ui/controls/child/templates/radioButtonGroup-dialog.tpl'
], function(BaseControl, TextControlProperty, MultilineTextControlProperty, tpl) {

    'use strict';

    var RadioButtonGroupControl = BaseControl.extend({
        init: function() {

        	// initialise radio button options
            this.radioButtonOptions = [{
                label: 'Option 1',
                value: '1'
            }, {
                label: 'Option 2',
                value: '2'
            }];

            this._super({
                type: 'radiobuttongroup',
                label: 'Radio Button Group',
                icon: 'f10c',
                inlineIcon: 'circle-blank',
                controlProperties: [
                    new TextControlProperty({
                        uid: 'description',
                        label: 'Description',
                        defaultValue: 'Description',
                        helpText: 'Instructions / help text for this control'
                    }),
                    // options:
					new MultilineTextControlProperty({
						uid: 'options',
						label: 'Options',
						defaultValue: '',
						helpText: 'Enter options, one per line',
						value: this.translateOptionsToText()
					})
                ]
            });
        },
        translateOptionsToText: function() {
            return _.pluck(this.radioButtonOptions, 'label').join('\n');
        },
        translateTextToOptions: function(text) {
            _.filter(
                _.map(text.split('\n'), function(obj) {
                    return {
                        label: obj,
                        value: ''
                    };
                }),
                function(obj) {
                    return obj.label.length > 0;
                });
        },
        render: function() {
            var template = _.template(tpl);

            return template({
                control: this
            });
        },
        // getDialogMarkup: function() {

        //     var template = _.template(dtpl);

        //     return template({
        //         control: this
        //     });
        // }

    });

    return RadioButtonGroupControl;

});
