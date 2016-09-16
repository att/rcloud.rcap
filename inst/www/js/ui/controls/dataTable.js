define(['rcap/js/ui/controls/gridControl', 
    'rcap/js/ui/controls/properties/textControlProperty',
    'rcap/js/ui/controls/properties/autocompleteControlProperty',
    'rcap/js/ui/controls/properties/dropdownControlProperty',
    'utils/translators/sparklinesTranslator',
    'text!controlTemplates/dataTable.tpl',
    'datatables/jquery.dataTables.min',
    'datatablesbuttons/buttons.html5.min',
    'jquery.sparkline/jquery.sparkline.min'
], function(GridControl, TextControlProperty, AutocompleteControlProperty, DropdownControlProperty, SparklinesTranslator, tpl) {

    'use strict';

    var DataTableControl = GridControl.extend({
        init: function() {
            this._super({
                type: 'datatable',
                controlCategory: 'Dynamic',
                label: 'Data Table',
                icon: 'table',
                controlProperties: [
                    new AutocompleteControlProperty({
                        uid: 'code',
                        label: 'Code',
                        value: '',
                        helpText: 'The R Function that assigns the data for this control',
                        isRequired: false,
                        isHorizontal: true
                    }),
                    new TextControlProperty({
                        uid: 'sortColumnIndex',
                        label : 'Initial Sort Column',
                        value : '1',
                        helpText : 'Which column should the data be sorted on.',
                        isRequired: true,
                        isHorizontal: true
                    }),
                    new DropdownControlProperty({
                        uid: 'sortColumnOrder',
                        label: 'Initial Sort Order',
                        isRequired: true,
                        availableOptions: [{
                            text: 'Ascending',
                            value: 'asc'
                        }, {
                            text: 'Descending',
                            value: 'desc'
                        }],
                        helpText: 'What order should the data be sorted',
                        value: 'asc',
                        isHorizontal: true
                    }),
                    new DropdownControlProperty({
                        uid: 'showPaging',
                        label: 'Show paging', 
                        isRequired: true,
                        availableOptions: [{
                            text: 'Yes',
                            value: 'true'
                        }, {
                            text: 'No',
                            value: 'false'
                        }],
                        helpText: 'Whether paging options should be shown',
                        value: 'false',
                        isHorizontal: true
                    }),
                    new DropdownControlProperty({
                        uid: 'showSearch',
                        label: 'Show search', 
                        isRequired: true,
                        availableOptions: [{
                            text: 'Yes',
                            value: 'true'
                        }, {
                            text: 'No',
                            value: 'false'
                        }],
                        helpText: 'Whether search box should be shown',
                        value: 'false',
                        isHorizontal: true
                    }),
                    new DropdownControlProperty({
                        uid: 'showInfo',
                        label: 'Show info', 
                        isRequired: true,
                        availableOptions: [{
                            text: 'Yes',
                            value: 'true'
                        }, {
                            text: 'No',
                            value: 'false'
                        }],
                        helpText: 'Whether information footer should be shown',
                        value: 'false',
                        isHorizontal: true
                    }),
                    new DropdownControlProperty({
                        uid: 'downloadAsCsv',
                        label: 'Download as CSV', 
                        isRequired: true,
                        availableOptions: [{
                            text: 'Yes',
                            value: 'true'
                        }, {
                            text: 'No',
                            value: 'false'
                        }],
                        value: 'true',
                        helpText: 'Allow user to download data as CSV',
                        isHorizontal: true
                    }),
                    new DropdownControlProperty({
                        uid: 'pageLength',
                        label: 'Page length',
                        value: '10',
                        availableOptions: [{
                            text: '10',
                            value: '10'
                        }, {
                            text: '25',
                            value: '25'
                        }, {
                            text: '50',
                            value: '50'
                        }, {
                            text: '100',
                            value: '100'
                        }],
                        helpText: 'Number of rows per page',
                        isHorizontal: true
                    })
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

            var output = template({
                control: this,
                isDesignTime: isDesignTime,
                designTimeDescription : designTimeDescription,
                paging: this.getControlPropertyValueOrDefault('showPaging') === 'true',
                info: this.getControlPropertyValueOrDefault('showInfo') === 'true',
                searching: this.getControlPropertyValueOrDefault('showSearch') === 'true',
                sortColumnIndex: this.getControlPropertyValueOrDefault('sortColumnIndex') - 1,
                sortColumnOrder: this.getControlPropertyValueOrDefault('sortColumnOrder'),
                downloadAsCsv: this.getControlPropertyValueOrDefault('downloadAsCsv') === 'true',
                pageLength: this.getControlPropertyValueOrDefault('pageLength')
            });

            return output;
        },
        updateData : function(controlId, result) {

            result = JSON.parse(result);

            if($.fn.DataTable.isDataTable('#' + controlId)) {
                var dt = $('#' + controlId).dataTable().api();
                dt.destroy();
                $('#' + controlId).empty();
            } 

            var controlData = $('#' + controlId).data();
            
            var dtProperties = {
                dom: 'Blfrtip', 
                data:  result.data,
                columns: result.columns.map(function(col) { 
                    return { 
                        data: col.replace(/\./g,'\\.'), // escape '.' for datatables 
                        title: col 
                    }; 
                })
            };

            // pass in dynamic options from R
            // but first, need to tidy up
            result.options.datatables.columnDefs = _.flatten(result.options.datatables.columnDefs);
            var cellDefs = result.options.datatables.cellDefs[0];
            delete result.options.datatables.cellDefs;
            $.extend(true, dtProperties, 
                result.options.datatables);

            // sparklines stuff
            var translator = new SparklinesTranslator();
            var translatedOptions = translator.translate(result.options.sparklines);
            var additionalColDefs = translatedOptions.columnDefs;
            dtProperties.columnDefs = dtProperties.columnDefs.concat(additionalColDefs);
            dtProperties.fnDrawCallback = translatedOptions.fnDrawCallback;
            
            // pass in options from form
            $.extend(true, dtProperties, 
                {
                    info: controlData.info,
                    searching: controlData.searching,
                    // input order will be R-centric (1-offset), where JavaScript is 0-offset:
                    order: [controlData.sortcolumnindex, controlData.sortcolumnorder],
                    buttons: controlData.downloadAsCsv ? ['csv'] : []
                }
            );
            dtProperties.fnRowCallback = function( nRow, aData ) {
                var rowPos = this.fnGetPosition( nRow );
                Object.keys(aData).forEach(function(value, i) {
                    // have we got an item in cellDefs matching iDisplayIndexFull and i (column):
                    var cellDef = _.findWhere(cellDefs, { column : value, row : rowPos });
                    if(cellDef) {
                        $('td:eq(' + i +')', nRow).addClass(cellDef.className);
                    }
                });
            };
            $('#' + controlId).DataTable(dtProperties);
            
            // data table colors
            var tableid = result.options.datatables.tableid;
            $(tableid).remove();
            var dtcols = result.options.datatables.css;
            $('head').append(dtcols);

            // cell classes

            // font sizes
            $('#' + controlId + 'th').css('font-size', result.options.css.thSize);
            $('#' + controlId + 'td').css('font-size', result.options.css.tdSize);

        }
    });

    return DataTableControl;

});