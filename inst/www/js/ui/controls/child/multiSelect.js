define(['rcap/js/ui/controls/baseControl', 'rcap/js/ui/properties/textProperty',
	'rcap/js/ui/properties/multiOptionProperty', 'text!rcap/js/ui/controls/child/templates/multiSelect.tpl', 'select2/js/select2', 'css!select2/css/select2.min.css'],
	function(BaseControl, TextProperty, MultiOptionProperty, tpl) {
	
	'use strict';

	var MultiSelectControl = BaseControl.extend({
		init: function() {
			this._super({
				type : 'multiselect',
				label : 'Multi-select',
				icon: 'indent-right',
				controlProperties: [
					new TextProperty({
						uid: 'label',
						label : 'Label',
						defaultValue : 'Label',
						helpText : 'The label for this control',
						isHorizontal: false
					}),
					new TextProperty({
						uid: 'placeholder',
						label : 'Placeholder',
						defaultValue : 'Please select an option',
						helpText : 'The placeholder for this control',
						isHorizontal: false
					}),
					new TextProperty({
						uid: 'variablename',
						label : 'Variable name',
						defaultValue : 'variable',
						helpText : 'The variable associated with this control',
						isRequired: true,
						isHorizontal: false
					}),
					// options:
                    new MultiOptionProperty({
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
                    })
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