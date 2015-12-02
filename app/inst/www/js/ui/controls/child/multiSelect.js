define(['rcap/js/ui/controls/baseControl', 'rcap/js/ui/controls/properties/textControlProperty',
	'rcap/js/ui/controls/properties/multiOptionControlProperty', 'text!rcap/js/ui/controls/child/templates/multiSelect.tpl', 'select2/js/select2', 'css!select2/css/select2.min.css'],
	function(BaseControl, TextControlProperty, MultiOptionControlProperty, tpl) {
	
	'use strict';

	var MultiSelectControl = BaseControl.extend({
		init: function() {
			this._super({
				type : 'multiselect',
				label : 'Multi-select',
				icon: 'indent-right',
				controlProperties: [
					new TextControlProperty({
						uid: 'label',
						label : 'Label',
						defaultValue : 'Label',
						helpText : 'The label for this control',
						isHorizontal: false
					}),
					new TextControlProperty({
						uid: 'placeholder',
						label : 'Placeholder',
						defaultValue : 'Please select an option',
						helpText : 'The placeholder for this control',
						isHorizontal: false
					}),
					new TextControlProperty({
						uid: 'variablename',
						label : 'Variable name',
						defaultValue : 'variable',
						helpText : 'The variable associated with this control',
						isRequired: true,
						isHorizontal: false
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
                        isRequired: true,
                        isHorizontal: false
                    }),

                    //
                    //	MAX SELECTION LIMIT
                    //

				]
			});
		},
		render: function(options) {
			
			options = options || {};
			options.isInFormBuilder = options.isInFormBuilder || false;

            var template = _.template(tpl);

            return template({
                control: this,
				// to differentiate it from the control that may already exist on the main design surface:
                controlId: options.isInFormBuilder ? this.id + '-formbuilderhosted' : this.id,
                isDesignTime: options.isDesignTime || false
            });
            
		}
	});

	return MultiSelectControl;

});