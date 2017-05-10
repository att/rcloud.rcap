define(['rcap/js/ui/controls/gridControl',
    'text!rcap/partials/dialogs/_formBuilder.htm',
    'text!ui/templates/selectOptions.tpl',
    'rcap/js/ui/properties/colorProperty',
    'rcap/js/ui/properties/dropdownProperty',
    'utils/variableHandler',
    'rcap/js/utils/rcapLogger'],
    function(GridControl, tpl, selectOptionsTpl, ColorProperty, DropdownProperty, variableHandler, RcapLogger) {

    'use strict';

    var rcapLogger = new RcapLogger();

    var FormControl = GridControl.extend({
        init: function() {
            this._super({
                type: 'form',
                controlCategory: 'HTML',
                label: 'Form',
                icon: 'list-alt',
                controlProperties: [

                ]
            });

            this.childControls = [
                // initially empty, will be modified by the user
            ];

            // additional property specifically for forms:
            this.styleProperties.push(
                new ColorProperty({
                    uid: 'labelColor',
                    label: 'Label Color',
                    helpText: '',
                    defaultValue: '#000'
                }));

            this.styleProperties.push(
                new DropdownProperty({
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

            var childParent,
                that = this,
                html = '<form action="" style="display: flex;align-self:' + this.getStylePropertyValueOrDefault('verticalalignment') + '"><div id="' + this.id + '" class="rcap-form' + '">';

            $.each(this.childControls, function(key, child) {

                childParent = $('<div />').attr('class', 'form-group').html(child.render(options));

                var cssClass = that.getChildCssClass(child);
                if(cssClass.length) {
                  childParent.addClass('rcap-custom-' + cssClass);
                }

                html += $(childParent)[0].outerHTML;
            });

            html += '</div></form>';

            return html;
        },
        getChildCssClass: function(child) {
          var cssClassStyleProperty = _.findWhere(child.styleProperties, { uid : 'cssclass' });
          return cssClassStyleProperty ? cssClassStyleProperty.value : '';
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
        initialiseForm: function() {

          // dialog based selections for select html elements:
          $('select[data-selectiontype="dialog"]').each(function() {
            var $select = $(this);
            $(this).mousedown(function() {
              // get options, present in dialog:
              var template = _.template(selectOptionsTpl);
              $('body').append(template({
                values: $.map($(this).find('option'), function(option) {
                  return {
                    value: option.value,
                    selected: $(option).is(':selected')
                  };
                }),
                label: $select.attr('data-label')
              }));

              $('#select-options').css('width', '100%');
              $('#select-options a').click(function() {
                $('#select-options').css('width', '0%');

                if(!$(this).hasClass('close')) {

                  if($select.val() !== $(this).html()) {
                    $select.val($(this).html()).trigger('change');
                  }
                }

                $('#select-options').remove();
              });

              return false;
            });
          });

        },
        initialiseViewerItems: function() {

            var data;

            this.initialiseForm();

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
                                interval: +(toAdd),
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

                        variableHandler.submitChange(data);
                    });
                } else {

                    var submitChange = function(control) {
                        var value = getVarData(control);
                        if(value) {
                            variableHandler.submitChange(value);
                        }
                    };

                    var controls = $(this).find('[data-variablename]');

                    $.each(controls, function() {

                        // special handling for slider:
                        if($(this).hasClass('irs-hidden-input')) {
                            var sliderControl = $(this);
                            var slider = $(this).data('ionRangeSlider');
                            slider.update({
                                onFinish: function(data) {
                                    submitChange(sliderControl);
                                    console.log('onFinish!', data);
                                }
                            });
                        } else {
                            $(this).on('change', function() {
                                submitChange($(this));
                            });
                        }
                    });
                }
            });
        },
        updateControls : function(variableName, value, allValues) {

            rcapLogger.log('%cR%c → %cJS%c: variable \'' + variableName + '\' with value: ' + JSON.stringify(value) + ', allValues: ' + JSON.stringify(allValues), 'font-weight: bold; color: blue; background-color: #eee', 'color: black', 'color: black; background-color: yellow; font-weight: bold', 'color: black');

            // convert to a string if it's a boolean:
            if(_.isBoolean(value)) {
                value = value.toString();
            }

            if (allValues && allValues.hasOwnProperty('selected') &&
                allValues.hasOwnProperty('value')) {
                value = allValues.selected;
                allValues = allValues.value;
            }

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

                        _.each(allValues, function(value/*, index*/) {
                            // fragment:
                            $(e).append('<div class="form-option"><label><input type="' + groupType + '" name="' + $(e).attr('id') + '" value="' + value + '">' + value + '</label>');
                        });
                    }
                }

                var findByCaseInsensitiveValue = function(parent, inputValue) {
                    return parent.find('input').filter(function() {
                        return $(this).attr('value').toLowerCase() === inputValue;
                    });
                };

                if(value || allValues) {
                    if($(e).data('select2')) {
                        $(e).val(value).trigger('change');
                    } else if($(e).data('ionRangeSlider')) {
                        $(e).data('ionRangeSlider').update({ from : value });
                    } else if($(e).hasClass('radiobutton-group')) {
                        var item = findByCaseInsensitiveValue($(e), value);
                        if(item) {
                            item.prop('checked', true);
                        }

                        //$(e).find('input[value="' + value + '"]').prop('checked', true);
                    } else if($(e).hasClass('checkbox-group')) {
                        // clear and set:
                        $(e).find('input').prop('checked', false);

                        if(_.isArray(value)) {
                           _.each(value, function(v) {
                                var cbItem = findByCaseInsensitiveValue($(e), v);
                                if(cbItem) {
                                    cbItem.prop('checked', true);
                                }

                            });
                        } else {
                            var cbItem = findByCaseInsensitiveValue($(e), value);
                            if(cbItem) {
                                cbItem.prop('checked', true);
                            }
                        }
                    } else if($(e).hasClass('daterange')) {

                        if($(e).data('hasinterval')) {
                            // from + interval:
                            $(e).find('input:eq(0)').val(value.from);
                            $(e).find('input:eq(1)').val(value.interval).trigger('set');
                        } else {
                            // from/to:
                            $(e).find('input:eq(0)').val(value.from);
                            $(e).find('input:eq(1)').val(value.to);
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
