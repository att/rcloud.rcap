define(['controls/factories/controlFactory', 'pubsub', 'site/pubSubTable'], function(ControlFactory, PubSub, pubSubTable) {

    'use strict';

    var FormBuilder = Class.extend({

        initialise: function() {

            var updateConfigurationContent = function(control) {

                $('#formbuilder-form-no-item').hide();

                $('#formbuilder-form .js-rcap-dynamic').html(control.getDialogMarkup());

                // don't forget the 'save' button, if there are control properties:
                if (control.controlProperties.length > 0) {
                    $('#formbuilder-form .js-rcap-dynamic').append($('<button class="btn btn-primary">Update</button>'));
                }
            };

            var updateChildControls = function() {
                // get the main control:
                var parentControl = $('#dialog-form-builder').data('control');

                // clear:
                parentControl.childControls = [];

                // and get based on order or state after deletion:
                $('#dialog-form-builder .form-item').each(function() {
                    parentControl.childControls.push($(this).data('control'));
                });
            };

            var me = this;
            me.controlFactory = new ControlFactory();

            // parsley:
            $('#formbuilder-form').parsley({
                excluded: 'input[type=button], input[type=submit], input[type=reset], :input[type=hidden], :disabled, input:hidden'
            });

            $('.drop-zone').on('click', '.ui-remove', function(e) {

                $(this).parent().remove();

                updateChildControls();

                $('#formbuilder-form-no-item').show();
                $('#formbuilder-form .js-rcap-dynamic').html('');

                e.preventDefault();
                return false;
            });

            // CLICK FORM ITEM IN LIST:
            $('.drop-zone').on('click', '.form-item', function() {

                $('.drop-zone .form-item').removeClass('selected');
                $(this).addClass('selected');

                var currentControl = $(this).data('control');

                updateConfigurationContent(currentControl);

                $('#dialog-form-builder .nav-tabs li:eq(1) a').tab('show');
            });

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //
            // child control validation:
            //
            $('body').on('click', '#formbuilder-form .btn-primary', function() {
                $('#formbuilder-form').parsley().validate();

                if (true === $('#formbuilder-form').parsley().isValid()) {

                    // remove any 'parsley valid' classes:
                    $('#formbuilder-form *').removeClass('parsley-success');

                    var originatingControl = $('#dialog-form-builder .form-item.selected').data('control');

                    $.each(originatingControl.controlProperties, function(index, prop) {
                        var dialogValue = prop.getDialogValue();
                        originatingControl.controlProperties[index].value = dialogValue;
                    });

                    // set:
                    $('#dialog-form-builder .form-item.selected').effect('highlight', {
                        color: '#f7a24d'
                    }, 1000);

                    $('#dialog-form-builder .form-item.selected').data('control', originatingControl);

                    // update UI:
                    var updateItem = $('#dialog-form-builder .form-item.selected').find('.js-dynamic');
                    updateItem.html(originatingControl.render({
                        'isDesignTime': true
                    }));

                    //console.log('VALID');

                    return false;

                } else {

                    //console.log('INVALID');

                }
            });


            $('#dialog-form-builder .approve').on('click', function() {

                var formControl = $('#dialog-form-builder').data('control');

                // update the control with styling information:
                // get style properties:
                $.each(formControl.styleProperties, function(index, prop) {
                    formControl.styleProperties[index].value = prop.getDialogValue();
                });

                PubSub.publish(pubSubTable.updateControl, formControl);

                $('#dialog-form-builder').jqmHide();
            });

            $('#dialog-form-builder .controls li').draggable({
                start: function() {

                },
                helper: function(e) {
                    //<a class="caret" href="javascript:void(0)"></a>
                    return $('<div><div class="ui-remove" href="javascript:void(0)"></div><div class="js-dynamic">' + $(e.target).text() + '</div></div>')
                        .addClass('form-item');
                },
                connectToSortable: '.drop-zone'
            });

            $('.drop-zone').sortable({
                placeholder: 'form-item-placeholder',
                update: function(event, ui) {
                    ui.item.addClass('form-item');
                },
                start: function( /*e, ui*/ ) {

                },
                stop: function() {
                    $('#dialog-form-builder .nav-tabs li:eq(1) a').tab('show');
                    updateChildControls();
                },
                remove: function() {
                    updateChildControls();
                },
                receive: function(event, ui) {

                    // create a default child with default properties:
                    var child = me.controlFactory.getChildByKey(ui.item.data('type'));

                    // render the item's content based on the child's information:
                    ui.helper.find('.js-dynamic').html(child.render({
                        'isDesignTime': true
                    }));

                    // update the data for this child control:
                    ui.helper.data('control', child);
                    updateConfigurationContent(child);

                    // add the child to the child controls:
                    //var parentControl = $('#dialog-form-builder').data('control');
                    //parentControl.childControls.push(child);

                    // styling:
                    $('.drop-zone .form-item').removeClass('selected');
                    ui.helper.addClass('dropped selected');

                    ui.helper.css('height', '');

                    updateChildControls();
                }
            });

            return this;
        },

        intialiseFormBuilderMenu: function() {
            var childControls = new ControlFactory().getChildControls();
            var templateStr = '<% _.each(controls, function(control){ %><li data-type="<%=control.type%>"><a href="#" class="control-<%=control.type %>" title="Add <%=control.label%>"><i class="icon-<%=control.icon%>"></i><%= control.label %></a></li><% }); %>';
            var template = _.template(templateStr);
            $('#dialog-form-builder .controls').append(template({
                controls: childControls
            }));

            return this;
        },

        setFormControl: function(control) {

            // clear stuff and reset:
            $('#dialog-form-builder .drop-zone, #formbuilder-form .js-rcap-dynamic').empty();

            // styling information:
            $('#formbuilder-form-style').html(control.getStyleDialogMarkup());

            // ensure that the 'items' tab is selected:
            $('#dialog-form-builder .nav-tabs li:eq(0) a').tab('show');

            // set the data:
            $('#dialog-form-builder').data('control', control);

            $.each(control.childControls, function(key, child) {

                // add an item and set its data:
                var item = $('<div class="form-item dropped"><div class="ui-remove" href="javascript:void(0)"></div><div class="js-dynamic">' +
                    child.render({
                        'isDesignTime': true,
                        'isInFormBuilder' : true,
                    }) + '</div></div>').data('control', child);

                $('#dialog-form-builder .drop-zone').append(item);

            });
        }
    });

    return FormBuilder;
});
