define([
    'controls/iframe',
    'controls/image',
    'controls/rText',
    'controls/rPlot',
    'controls/text',
    'controls/pageMenu',
    'controls/breadcrumb',
    'controls/interactivePlot',
    'controls/form',
    'controls/dataTable',
    //////////////////////
    'controls/child/textField',
    'controls/child/datePicker',
    'controls/child/dropdown',
    'controls/child/separator',
    'controls/child/heading',
    'controls/child/multiSelect',
    'controls/child/checkboxList',
    'controls/child/radioButtonGroup',
    'controls/child/slider',
    'controls/child/submitButton',

], function(IFrameControl, ImageControl, RTextControl, RPlotControl, TextControl, PageMenuControl, BreadcrumbControl, InteractivePlotControl, FormControl, DataTableControl,
    ///////////////////////
    TextFieldControl,
    DatePickerControl,
    DropdownControl,
    SeparatorControl,
    HeadingControl,
    MultiSelectControl,
    CheckboxListControl,
    RadioButtonGroupControl,
    SliderControl,
    SubmitButtonControl) {

    'use strict';

    function ControlFactory() {
        this.gridControls = [
            new RPlotControl(),
            new InteractivePlotControl(),
            new RTextControl(),
            new DataTableControl(),
            new FormControl(),
            new IFrameControl(),
            new ImageControl(),
            new PageMenuControl(),
            new BreadcrumbControl(),
            new TextControl()

            //new DatePickerControl(),
            //new DropdownControl(),
        ];

        this.childControls = [
            new TextFieldControl(),
            new DatePickerControl(),
            new DropdownControl(),
            new MultiSelectControl(),
            new CheckboxListControl(),
            new RadioButtonGroupControl(),
            new SliderControl(),
            new SeparatorControl(),
            new HeadingControl(),
            new SubmitButtonControl()
        ];
    }

    ControlFactory.prototype.getGridControls = function() {
        return this.gridControls;
    };

    ControlFactory.prototype.getGridControlsByCategory = function() {
        
        // with rudimentary category sort:
        return _
            .chain(this.gridControls)
            .groupBy('controlCategory')
            .map(function(value, key) {
                return {
                    type: key,
                    controls: value
                };
            })
            .sortBy(function(value) { return ['Dynamic', 'Data', 'HTML', 'Navigation'].indexOf(value.type); })
            .value();

    };

    ControlFactory.prototype.getChildControls = function() {
        return this.childControls;
    };

    // ControlFactory.prototype.getAll = function() {
    // 	return this.controls;
    // };

    ControlFactory.prototype.getByKey = function(key) {
        // TODO: improve this (each 'control' knows its own string identity...)

        var control;

        switch (key) {
            //case 'datepicker': control = new DatePickerControl(); break;
            //case 'dropdown': control = new DropdownControl(); break;
            case 'iframe':
                control = new IFrameControl();
                break;
            case 'image':
                control = new ImageControl();
                break;
            case 'rplot':
                control = new RPlotControl();
                break;
            case 'rtext':
                control = new RTextControl();
                break;
            case 'interactiveplot':
                control = new InteractivePlotControl();
                break;
            case 'datatable':
                control = new DataTableControl();
                break;
            case 'text':
                control = new TextControl();
                break;
            case 'pagemenu':
                control = new PageMenuControl();
                break;
            case 'breadcrumb':
                control = new BreadcrumbControl();
                break;
            case 'form':
                control = new FormControl();
                break;
            default:
                control = undefined;
                break;
        }

        return control;
    };

    ControlFactory.prototype.getChildByKey = function(key) {
        // TODO: improve this (each 'control' knows its own string identity...)

        var control;

        switch (key) {
            case 'textfield': 
                control = new TextFieldControl();
                break;
            case 'datepicker':
                control = new DatePickerControl();
                break;
            case 'dropdown':
                control = new DropdownControl();
                break;
            case 'multiselect':
                control = new MultiSelectControl();
                break;
            case 'checkboxlist':
                control = new CheckboxListControl();
                break;
            case 'radiobuttongroup':
                control = new RadioButtonGroupControl();
                break;
            case 'heading':
                control = new HeadingControl();
                break;
            case 'separator':
                control = new SeparatorControl();
                break;
            case 'submitbutton':
                control = new SubmitButtonControl();
                break;
            case 'slider': 
                control = new SliderControl();
                break;
            default:
                control = undefined;
                break;
        }

        return control;
    };


    return ControlFactory;

});
