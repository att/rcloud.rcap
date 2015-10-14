define(['rcap/js/ui/controls/baseControl', 'rcap/js/ui/controls/properties/textControlProperty',
	'rcap/js/ui/controls/properties/multiOptionControlProperty', 'text!rcap/js/ui/controls/child/templates/dropdown.tpl'],
	function(BaseControl, TextControlProperty, MultiOptionControlProperty, tpl) {
	
	'use strict';

	var DropdownControl = BaseControl.extend({
		init: function() {
			this._super({
				type : 'dropdown',
				label : 'Dropdown',
				icon: 'list',
				controlProperties: [
					new TextControlProperty({
						uid: 'label',
						label : 'Label',
						defaultValue : 'Label',
						helpText : 'The label for this control'
					}),
					new TextControlProperty({
						uid: 'variablename',
						label : 'Variable name',
						defaultValue : 'variable',
						helpText : 'The variable associated with this control',
						isRequired: true
					}),
					// options:
                    new MultiOptionControlProperty({
                        uid: 'options',
                        label: 'Options',
                        helpText: 'Enter options, one per line',
                        value: [{
                            label: 'Option 1',
                            value: '1'
                        }, {
                            label: 'Option 2',
                            value: '2'
                        }],
                        isRequired: true
                    })
				]
			});
		},
		render: function(options) {
			
			options = options || {};

            var template = _.template(tpl);

            return template({
                control: this,
                isDesignTime: options.isDesignTime || false
            });
            
		}
	});

	return DropdownControl;

});