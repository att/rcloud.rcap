define(['rcap/js/ui/controls/gridControl',
	'rcap/js/ui/properties/textProperty',
	'rcap/js/ui/properties/wysiwygProperty'], function(GridControl, TextProperty, WysiwygProperty) {

	'use strict';

	var TextControl = GridControl.extend({
		init: function() {
			this._super({
				type : 'text',
				controlCategory: 'HTML',
				label : 'Text',
				icon: 'pencil',
				controlProperties: [
					new WysiwygProperty({
						uid: 'content',
						label : 'Content',
						defaultValue : '',
						isRequired: true
					})
				]
			});
		},
		render: function() {
 			return '<div class="text-control-content ql-editor ql-viewer">' + this.controlProperties[0].value + '</div>';
		}
	});

	return TextControl;

});
