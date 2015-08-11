define([
	'controls/datePicker',
	'controls/dropdown',
	'controls/iframe',
	'controls/image',
	'controls/rPlot',
	'controls/text',
	'controls/webPlot'
	], function(DatePickerControl, DropdownControl, IFrameControl, ImageControl, RPlotControl, TextControl, WebPlotControl) {
	
	'use strict';

	function ControlFactory()  {
		this.controls = [
			new DatePickerControl(),
			new DropdownControl(),
			new IFrameControl(),
			new ImageControl(),
			new RPlotControl(),
			new TextControl(),
			new WebPlotControl()
		];
	};

	ControlFactory.prototype.getAll = function() {
		return this.controls;
	};

	ControlFactory.prototype.getByKey = function(key) {
		// TODO: improve this (each 'control' knows its own string identity...)
		switch(key){
			case 'datepicker': return new DatePickerControl(); break;
			case 'dropdown': return new DropdownControl(); break;
			case 'iframe': return new IFrameControl(); break;
			case 'image': return new ImageControl(); break;
			case 'rplot': return new RPlotControl(); break;
			case 'text': return new TextControl(); break;
			case 'webplot': return new WebPlotControl(); break;
			default: return undefined; break;
		}
	};

	return ControlFactory;

});