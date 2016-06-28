define(['rcap/js/ui/controls/gridControl', 
    'rcap/js/ui/controls/properties/textControlProperty',
    'rcap/js/ui/controls/properties/autocompleteControlProperty',
    'rcap/js/ui/controls/properties/dropdownControlProperty',
    'utils/dataTranslators/dataTableTranslator',
    'text!controlTemplates/dataTable.tpl',
    'datatables/jquery.dataTables.min'
], function(GridControl, TextControlProperty, AutocompleteControlProperty, DropdownControlProperty, DataTableTranslator, tpl) {

    'use strict';

    var DataTableControl = GridControl.extend({
        init: function() {
            this._super({
                type: 'datatable',
                controlCategory: 'Dynamic',
                label: 'Data Table',
                icon: 'table',
                initialSize: [4, 4],
                controlProperties: [
                    new AutocompleteControlProperty({
                        uid: 'code',
                        label: 'Code',
                        defaultValue: '',
                        helpText: 'The R Function that assigns the data for this control',
                        isRequired: false
                    }),
                    new TextControlProperty({
                        uid: 'sortColumnIndex',
                        label : 'Initial Sort Column',
                        defaultValue : '1',
                        helpText : 'Which column should the data be sorted on.',
                        isRequired: true,
                        isHorizontal: false
                    }),
                    new DropdownControlProperty({
                        uid: 'sortColumnOrder',
                        label: 'Initial Sort Order',
                        isRequired: true,
                        defaultValue: 'asc',
                        availableOptions: [{
                            text: 'Ascending',
                            value: 'asc'
                        }, {
                            text: 'Descending',
                            value: 'desc'
                        }],
                        helpText: 'What order should the data be sorted',
                        value: 'asc',
                        isHorizontal: false
                    }),
                    new DropdownControlProperty({
                        uid: 'showPaging',
                        label: 'Show paging', 
                        isRequired: true,
                        defaultValue: 'false',
                        availableOptions: [{
                            text: 'Yes',
                            value: 'true'
                        }, {
                            text: 'No',
                            value: 'false'
                        }],
                        helpText: 'Whether paging options should be shown',
                        value: 'false',
                        isHorizontal: false
                    }),
                    new DropdownControlProperty({
                        uid: 'showSearch',
                        label: 'Show search', 
                        isRequired: true,
                        defaultValue: 'false',
                        availableOptions: [{
                            text: 'Yes',
                            value: 'true'
                        }, {
                            text: 'No',
                            value: 'false'
                        }],
                        helpText: 'Whether search box should be shown',
                        value: 'false',
                        isHorizontal: false
                    }),
                    new DropdownControlProperty({
                        uid: 'showInfo',
                        label: 'Show info', 
                        isRequired: true,
                        defaultValue: 'false',
                        availableOptions: [{
                            text: 'Yes',
                            value: 'true'
                        }, {
                            text: 'No',
                            value: 'false'
                        }],
                        helpText: 'Whether information footer should be shown',
                        value: 'false',
                        isHorizontal: false
                    }),
                    new DropdownControlProperty({
                        uid: 'downloadAsCsv',
                        label: 'Download as CSV', 
                        isRequired: true,
                        defaultValue: 'false',
                        availableOptions: [{
                            text: 'Yes',
                            value: 'true'
                        }, {
                            text: 'No',
                            value: 'false'
                        }],
                        helpText: 'Allow user to download data as CSV',
                        value: 'false',
                        isHorizontal: false
                    }),

                ]
            });
        },
        render: function(options) {

            options = options || {};
            var isDesignTime = options.isDesignTime || false;
            var template = _.template(tpl);
            var designTimeDescription = '';

            if(isDesignTime && this.controlProperties[0].value) {
                designTimeDescription += 'Function: ' + this.controlProperties[0].value;
            }

            return template({
                control: this,
                isDesignTime: isDesignTime,
                designTimeDescription : designTimeDescription,
                paging: this.getControlPropertyValueOrDefault('showPaging') === 'true',
                info: this.getControlPropertyValueOrDefault('showInfo') === 'true',
                searching: this.getControlPropertyValueOrDefault('showSearch') === 'true',
                sortColumnIndex: this.getControlPropertyValueOrDefault('sortColumnIndex') - 1,
                sortColumnOrder: this.getControlPropertyValueOrDefault('sortColumnOrder')
            });

        },
        updateData : function(controlId, data) {

            // do some stuff!
            var translator = new DataTableTranslator();
            var translatedData = translator.translate(data);

            if($.fn.DataTable.isDataTable('#' + controlId)) {
                var dt = $('#' + controlId).dataTable().api();
                dt.destroy();

                $('#' + controlId).empty();
            } 
                
            $('#' + controlId).DataTable( {
                data: translatedData.data,
                columns: translatedData.columns,
                paging: this.getControlPropertyValueOrDefault('showPaging') === 'true',
                info: this.getControlPropertyValueOrDefault('showInfo') === 'true',
                searching: this.getControlPropertyValueOrDefault('showSearch') === 'true',
                // input order will be R-centric (1-offset), where JavaScript is 0-offset:
                order: [$('#' + controlId).data('sortcolumnindex'), $('#' + controlId).data('sortcolumnorder')]
            });
        }
    });

    return DataTableControl;

});