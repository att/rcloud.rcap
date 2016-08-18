define([
    'controls/iframe',
    'controls/image',
    'controls/rText',
    'controls/rPlot',
    'controls/rPrint',
    'controls/text',
    'controls/pageMenu',
    'controls/breadcrumb',
    'controls/interactivePlot',
    'controls/form',
    'controls/dataTable',
    'controls/leaflet',
    'controls/htmlWidget',
    //////////////////////
    'controls/child/textField',
    'controls/child/datePicker',
    'controls/child/dateRange',
    'controls/child/dropdown',
    'controls/child/separator',
    'controls/child/heading',
    'controls/child/multiSelect',
    'controls/child/checkboxList',
    'controls/child/radioButtonGroup',
    'controls/child/slider',
    'controls/child/submitButton',

], function(IFrameControl, 
    ImageControl, 
    RTextControl, 
    RPlotControl, 
    RPrintControl,
    TextControl, 
    PageMenuControl, 
    BreadcrumbControl, 
    InteractivePlotControl, 
    FormControl, 
    DataTableControl,
    LeafletControl,
    HtmlWidgetControl,
    ///////////////////////
    TextFieldControl,
    DatePickerControl,
    DateRangeControl,
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
            new RPrintControl(),
            new InteractivePlotControl(),
            new LeafletControl(),
            new HtmlWidgetControl(),
            new RTextControl(),
            new DataTableControl(),
            new FormControl(),
            new IFrameControl(),
            new ImageControl(),
            new PageMenuControl(),
            new BreadcrumbControl(),
            new TextControl()
        ];

        this.childControls = [
            new TextFieldControl(),
            new DatePickerControl(),
            new DateRangeControl(),
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

    ControlFactory.prototype.getByKey = function(key) {

        var control;

        switch (key) {
            case 'iframe':
                control = new IFrameControl();
                break;
            case 'image':
                control = new ImageControl();
                break;
            case 'rplot':
                control = new RPlotControl();
                break;
            case 'rprint':
                control = new RPrintControl();
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
            case 'leaflet':
                control = new LeafletControl();
                break;
            case 'htmlwidget': 
                control = new HtmlWidgetControl();
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

        var control;

        switch (key) {
            case 'textfield': 
                control = new TextFieldControl();
                break;
            case 'datepicker':
                control = new DatePickerControl();
                break;
            case 'daterange':
                control = new DateRangeControl();
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
