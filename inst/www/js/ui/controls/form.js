define(['rcap/js/ui/controls/gridControl', 
    'text!rcap/partials/dialogs/_formBuilder.htm', 
    'rcap/js/ui/controls/properties/colorControlProperty',
    'rcap/js/ui/controls/properties/dropdownControlProperty',
    'rcap/js/utils/rcapLogger'], 
    function(GridControl, tpl, ColorControlProperty, DropdownControlProperty, RcapLogger) {

    'use strict';

    var rcapLogger = new RcapLogger();

    var FormControl = GridControl.extend({
        init: function() {
            this._super({
                type: 'form',
                controlCategory: 'HTML',
                label: 'Form',
                icon: 'list-alt',
                initialSize: [4, 2],
                controlProperties: [

                ]
            });

            this.childControls = [
                // initially empty, will be modified by the user
            ];

            // additional property specifically for forms:
            this.styleProperties.push(
                new ColorControlProperty({
                    uid: 'labelColor',
                    label: 'Label Color',
                    helpText: '',
                    defaultValue: '#000'
                }));

            this.styleProperties.push(
                new DropdownControlProperty({
                        uid: 'verticalalignment',
                        label: 'Vertical Alignment',
                        isRequired: true,
                        availableOptions: [{
                            text: 'Top',
                            value: 'initial'    // <- this should be 'initial'
                        }, {
                            text: 'Middle',
                            value: 'center'     // <- this should be 'center'
                        }],
                        defaultValue: 'initial'
                    })
            );
        },
        render: function(options) {

            var html = '<form action="" style="display: flex;align-self:' + this.getStylePropertyValueOrDefault('verticalalignment') + '"><div id="' + this.id + '" class="rcap-form' + '">';

            $.each(this.childControls, function(key, child) {
                html += '<div class="form-group">';
                html += child.render(options);
                html += '</div>';
            });

            html += '</div></form>';

            return html;
        },
        getDialogMarkup: function() {
            return tpl;
        },
        getStyleProperties: function() {
            var styleInfo = this._super();
            styleInfo.color = this.getStylePropertyByName('labelColor').value;

            return styleInfo;
        },
        toJSON: function() {
            var json = this._super();
            json.childControls = this.childControls;
            return json;
        },
        isValid: function() {
            // ensure that the 'invalid' item count is 0:
            return _.filter(this.controlProperties, function(p) {
                    return p.isRequired && (typeof p.value === 'undefined' || p.value.length === 0);
                }).length === 0 &&
                (_.filter(this.childControls, function(cp) {
                    return cp.isRequired && (typeof cp.value === 'undefined' || cp.value.length === 0);
                }).length === 0) && this.childControls.length > 0;
        },
        initialiseViewerItems: function() {

            var data;

            var getVarData = function(el) {

                // value dependent on control type:
                var value;

                if( el.hasClass('daterange')) {

                    var controlId = el.attr('id'),
                        startControl = $('#' + controlId + '-start');

                    var startDate = startControl.val();

                    // is this a range, or a start/interval?
                    if(el.data('hasinterval')) {

                        var intervalType = el.data('intervaltype');
                        var toAdd = $('#' + controlId + '-interval').val();

                        if(intervalType && toAdd && startDate) {
                            value = {
                                from: startDate,
                                interval: toAdd,
                                intervalType: intervalType
                            };
                        } else {
                            return undefined;
                        }

                    } else {
                        
                        var endDate = $('#' + controlId + '-end').val();

                        // validate:
                        if(startDate && endDate) {
                            value = {
                                from: startDate,
                                to: endDate
                            };
                        }
                    }
                } else if( el.hasClass('checkbox-group')) {
                    // get all selected checkboxes:
                    value = [];
                    el.find('input:checkbox:checked').each(function() 
                    {
                       value.push($(this).val());
                    });

                } else if( el.hasClass('radiobutton-group')) {
                    // get selected radio button:
                    value = el.find('input:checked').val();
                } else {
                    // either a checkbox list, radio buttons, or something 
                    // that we can use val() with:
                    value = el.val();
                }

                return {
                    variableName: el.attr('data-variablename'),
                    controlId: el.attr('id'),
                    value: value
                };
            };

            var submitVariableChange = function(variableData) {

                if(variableData.length) {
                    var plotSizes = [];

                    $('.rplot, .r-interactiveplot, .rhtmlwidget').each(function() {
                        var container = $(this).closest('.grid-stack-item-content');
                        plotSizes.push({
                            id : $(this).attr('id'),
                            width : container.data('width'),
                            height : container.data('height')
                        });
                    });
     
                    data = {
                        updatedVariables : variableData,
                        plotSizes : plotSizes
                    };

                    ///////////////////////////////////////////////////////
                    var dataToSubmit = JSON.stringify(data);
                    rcapLogger.log('Submitting data: ', dataToSubmit);
                    window.RCAP.updateControls(dataToSubmit);
                    ///////////////////////////////////////////////////////
                }

            };

            // if a form has a submit button, its data will be submitted when the form is submitted.
            // otherwise, the individual control will submit data following a change:
            $('.rcap-controltype-form').each(function() {
                if ($(this).find('button[type="submit"]').length > 0) {
                    $(this).find('form').submit(function(e) {

                        e.preventDefault();

                        // loop through each item:
                        data = [];
                        $(this).find('[data-variablename]').each(function() {
                            var value = getVarData($(this));

                            if(value) {
                                data.push(value);
                            }
                        });

                        submitVariableChange(data);
                    });
                } else {
                    $(this).find('[data-variablename]').change(function() {

                        var value = getVarData($(this));

                        if(value) {
                            submitVariableChange([value]);
                        }
                    });
                }
            });
        },
        updateControls : function(variableName, value, allValues) {
            
            rcapLogger.log('%cForm update: ' + variableName + ':' + value, 'padding: 2px; font-size: 12pt; border: 1px solid orange; background: #369; color: #fff');

            // find the control(s), determine type, and update:
            $('[data-variablename="' + variableName + '"]').each(function(i, e) {

                if(allValues) {
                    if($(e).is('select')) {

                        // remove then add:
                        $(e).children().remove();

                        _.each(allValues, function(value) {
                           $(e).append(
                            $('<option/>', {
                                'value' : value,
                                'text' : value
                            }));
                        });
                    } else if($(e).hasClass('radiobutton-group') || $(e).hasClass('checkbox-group')) {

                        $(e).children().remove();

                        var groupType = $(e).hasClass('radiobutton-group') ?
                            'radio' : 'checkbox';

                        _.each(allValues, function(value, index) {
                            // fragment:
                            var currentId = groupType + '-' + $(e).attr('id') + index;
                            $(e).append('<div class="form-option"><label for="' + currentId + '">' + value + '</label><input type="' + groupType + '" name="' + $(e).attr('id') + '" id="' + currentId + '" value="' + value + '"></div>');
                        });
                    }
                }

                if(value || allValues) {
                    if($(e).data('select2')) {
                        $(e).select2('val', value);
                    } else if($(e).data('ionRangeSlider')) {
                        $(e).data('ionRangeSlider').update({ from : value });
                    } else if($(e).hasClass('radiobutton-group')) {
                        $(e).find('input[value="' + value + '"]').prop('checked', true);
                    } else if($(e).hasClass('checkbox-group')) {
                        // clear and set:
                        $(e).find('input').prop('checked', false);

                        if(_.isArray(value)) {
                           _.each(value, function(v) {
                                $(e).find('input[value="' + v + '"]').prop('checked', true);
                            });
                        } else {
                            $(e).find('input[value="' + value + '"]').prop('checked', true);    
                        }
                    } else if($(e).hasClass('daterange') && _.isArray(value) && value.length === 2) {
                        $(e).find('input:eq(0)').val(value[0]);
                        $(e).find('input:eq(1)').val(value[1]);
                    } else {
                        // catch all:
                        $(e).val(value);
                    }
                }
            });
        }
    });

    return FormControl;

});
