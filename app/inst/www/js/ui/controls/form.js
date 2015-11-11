define(['rcap/js/ui/controls/gridControl', 
    'text!rcap/partials/dialogs/_formBuilder.htm', 
    'rcap/js/ui/controls/properties/colorControlProperty'], 
    function(GridControl, tpl, ColorControlProperty) {

    'use strict';

    var FormControl = GridControl.extend({
        init: function() {
            this._super({
                type: 'form',
                label: 'Form',
                icon: 'list-alt',
                initialSize: [2, 1],
                controlProperties: [
                    // TODO : general form properties!
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
                    defaultValue: '#000000',
                    value: '#000000'
                }));
        },
        render: function(options) {

            var html = '<form action=""><div id="' + this.id + '" class="rcap-form">';

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

/*
                if( el.data('select2')) {
                    value = _.pluck(el.select2('data'), 'text');
                } else if( el.is('select')) {
                    value = el.find('option:selected').val();
                } else */

                if( el.hasClass('checkbox-group')) {
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
                // var notebookResult = window.notebook_result; // jshint ignore:line
                // if (notebookResult) {
                //     notebookResult.updateVariable(data);
                // } else {
                //     console.log('window.notebook_result is not available, varchange data is: ', JSON.stringify(data));
                // }

                var plotSizes = [];

                $('.rplot').each(function() {
                    var container = $(this).closest('.grid-stack-item-content');
                    plotSizes.push({
                        id : $(this).attr('id'),
                        width : container.width() - 25,
                        height: container.height() - 25
                    });
                });
 
                data = {
                    updatedVariables : variableData,
                    plotSizes : plotSizes
                };

                ///////////////////////////////////////////////////////
                var dataToSubmit = JSON.stringify(data);
                console.log('Submitting data: ', dataToSubmit);
                window.RCAP.updateControls(dataToSubmit);
                ///////////////////////////////////////////////////////
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
                            data.push(getVarData($(this)));
                        });

                        submitVariableChange(data);
                    });
                } else {
                    $(this).find('[data-variablename]').change(function() {
                        submitVariableChange([
                            getVarData($(this))
                        ]);
                    });
                }
            });
        },
        updateControls : function(variableName, value, allValues) {
            
            console.log('%cForm update: ' + variableName + ':' + value, 'padding: 2px; font-size: 12pt; border: 1px solid orange; background: #369; color: #fff');

            // find the control(s), determine type, and update:
            $('[data-variablename="' + variableName + '"]').each(function(i, e) {

                // for now, hard-coded dropdown assumption:
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
                    } else if($(e).hasClass('radiobutton-group')) {
                        //$(e).children().remove();

                        /*
                        <div class="form-option">
                            <label for="radio-rcapd978b33a0">Option 1</label>
                            <input type="radio" name="radio-rcapd978b33a" id="radio-rcapd978b33a0" value="Option 1">
                        </div>
                                
                        <div class="form-option">
                            <label for="radio-rcapd978b33a1">Option 2</label>
                            <input type="radio" name="radio-rcapd978b33a" id="radio-rcapd978b33a1" value="Option 2">
                        </div>

                        */                        
                    } else if($(e).hasClass('checkbox-group')) {
                        //$(e).children().remove();
/*
                        <div class="form-option">
                                <label for="checkbox-rcap7018aefb0">Option 1</label>
                                <input type="checkbox" name="checkbox-rcap7018aefb" id="checkbox-rcap7018aefb0" value="Option 1">
                        </div>
*/                        
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
