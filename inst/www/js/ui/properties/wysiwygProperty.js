define(['rcap/js/ui/properties/baseProperty',
	'text!templates/wysiwyg.tpl',
	'quill/quill',
	'rcap/js/utils/quillRcapLink'
	], function(BaseProperty, tpl, Quill, registerQuillLink) { // jshint ignore:line
	'use strict';

	var WysiwygProperty = BaseProperty.extend({
		init: function(options) {
			options = options || {};
			this._super({
				type : 'wysiwyg',
				label : options.label || '',
				helpText : options.helpText || '',
				defaultValue : options.defaultValue || '',
				isRequired : options.isRequired || false,
				value : options.value || '',
				uid : options.uid,
				className : options.className
			});
		},
		render: function(childIndex) {

      if(!window.Quill) {
				window.Quill = Quill;
			}
			
			registerQuillLink();

			var template = _.template(tpl);

      return template({
        property : this,
        childIndex : childIndex
      });

		},
		getDialogValue : function() {
		  return $('#' + this.id).find('.ql-editor').html();
		}
	});

	return WysiwygProperty;

});
