define([
	'rcap/js/ui/properties/colorProperty',
	'rcap/js/ui/properties/dropdownProperty',
	'rcap/js/ui/properties/textProperty',
	'rcap/js/ui/properties/wysiwygProperty'
	], function(ColorProperty, DropdownProperty, TextProperty, WysiwygProperty) {
	
	'use strict';

	function PropertyFactory()  {
		this.controlProperties = [
			new ColorProperty(),
			new DropdownProperty(),
			new TextProperty(),
			new WysiwygProperty()
		];
	}

	PropertyFactory.prototype.getAll = function() {
		return this.controlProperties;
	};

	PropertyFactory.prototype.getByKey = function(key) {

		var Property;

		switch(key){
			case 'color': Property = new ColorProperty(); break;
			case 'dropdown': Property = new DropdownProperty(); break;
			case 'text': Property = new TextProperty(); break;
			case 'wysiwyg': Property = new WysiwygProperty(); break;
			default: Property = undefined; break;
		}

		return Property;
	};

	return PropertyFactory;

});