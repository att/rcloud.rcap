define([
    'controls/factories/controlFactory',
    'pubsub',
    'rcap/js/vendor/gridstack'
], function(ControlFactory, PubSub) {

    'use strict';

    return {

        initialise: function() {

            var me = this;

            me.controlFactory = new ControlFactory();

            // $('.grid-stack').on('click', function(e) {

            //     $('.grid-stack-item-content').removeClass('selected');

            //     var $clicked = $($(e.target)[0]);

            //     // if this is an item, add the class to this specific item:
            //     if ($clicked.hasClass('grid-stack-item-content')) {
            //         $clicked.addClass('selected');
            //     } else if ($clicked.hasClass('grid-stack')) {
            //         console.log('grid stack has been clicked!');
            //     }
            // });

            $('.grid-stack').gridstack({
                min_height_cellcount: 12, // jshint ignore:line
                cell_height: 80, // jshint ignore:line
                vertical_margin: 20, // jshint ignore:line
                animate: true,
                resizable: {
                    handles: 'e, se, s'
                },
                float: true
            });

            // append stuff:


            $('.grid-stack').on('dragstop', function (event) {
                var element = $(event.target);
                var node = element.data('_gridstack_node');
                element.data('control').x = node.x;
                element.data('control').y = node.y;
            });

            $('.grid-stack').on('resizestop', function (event) {
                var element = $(event.target);
                var node = element.data('_gridstack_node');
                element.data('control').width = node.width;
                element.data('control').height = node.height;
            });

            $('.grid-stack').on('change', function () {
                var items = $('.grid-stack-item[data-controlid]').length;

                //console.log('The number of widgets has changed...');

                if( items === 0) {
                    $('#no-items').fadeTo(500, 1);
                }
                else {
                    $('#no-items').fadeTo(100, 0, function() {
                        $(this).hide(); // so that is(':visible') check returns true!
                    });
                }
            });

            // delete selected item:
            // $('html').keyup(function(e) {
            //     if (e.keyCode === 46) {
            //         var $selectedItem = $('.grid-stack-item-content.selected + .ui-remove');

            //         if ($selectedItem.length === 1) {
            //             $($selectedItem[0]).trigger('click');
            //         }
            //     }
            // });

            var grid = $('.grid-stack').data('gridstack');

            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            $('#controls li').draggable({
                revert: true,
                revertDuration: 0,
                appendTo: '.grid-stack',
                containment: '.grid-stack',
                start: function() {
                    var control = me.controlFactory.getByKey($(this).data('type'));
                    grid.init_placeholder(control.initialWidth(), control.initialHeight()); // jshint ignore:line

                    if( $('#no-items').is(':visible')) {
                        $('#no-items').fadeTo(250, 0.1);
                    }
                },
                drag: function(event, ui) {
                    var cell = grid.get_cell_from_pixel(ui.helper.position()); // jshint ignore:line

//console.info(ui.helper.position());

//console.log('Placeholder $el', $('.grid-stack-placeholder').data());





                    grid.position_placeholder(cell.x, cell.y); // jshint ignore:line

//var placeholderPosition = grid.get_placeholder_position(); // jshint ignore:line
//console.info('placeholder pos: ', placeholderPosition);
                 

                },
                stop: function() {
                    grid.detach_placeholder(); // jshint ignore:line
                },
                helper: function() {
                    return $('<div style="background-color: #ddd; width: 75px; height: 75px;"">+</div>');
                }
            });

            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            $('.grid-stack').droppable({
                accept: '#controls li',
                hoverClass: 'grid-stack-item',
                over: function(event, ui) {
                    ui.helper.css('z-index', 9999);
                },
                drop: function(event, ui) {
                    var grid = $('.grid-stack').data('gridstack');
                    //var cell = grid.get_cell_from_pixel(ui.helper.position()); // jshint ignore:line
                    var placeholderPosition = grid.get_placeholder_position(); // jshint ignore:line

                    //console.info('placeholder pos: ', placeholderPosition);

                    // get the type:
                    var control = me.controlFactory.getByKey(ui.draggable.data('type'));

                    var defaultWidth = control.initialWidth(),
                        defaultHeight = control.initialHeight();

                    if (grid.is_area_empty(placeholderPosition.x, placeholderPosition.y, defaultWidth, defaultHeight)) { // jshint ignore:line

                        var newWidget = grid.add_widget($('<div data-controlid="' + control.id + '"><div class="grid-stack-item-content" data-gs-locked="true"><div class="configure">' + control.getConfigurationMarkup() + '<p><button type="button" class="btn btn-default">Configure</button></p></div></div></div>'), placeholderPosition.x, placeholderPosition.y, defaultWidth, defaultHeight, false);  // jshint ignore:line

                        // set the new element's control property:
                        control.x = +placeholderPosition.x;
                        control.y = +placeholderPosition.y;

                        newWidget.data('control', control); 

                        grid.locked(newWidget, true); 

                    }
                }
            });

            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //
            // configuration button click, show dialog:
            //
            $('body').on('click', '#inner-stage .configure button', function() {

                //console.log('controlDialog:show with data: ', $(this).closest('.grid-stack-item').data('control'));

                PubSub.publish('controlDialog:show', $(this).closest('.grid-stack-item').data('control'));
            });

            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //
            // update grid control item subscription:
            //
            PubSub.subscribe('controlDialog:updated', function(msg, control){ 

                // update the control's data: 
                var gridItem = $('.grid-stack-item[data-controlid="' + control.id + '"]');

                // and get the new markup:
                gridItem.find('.configure p:first').html(control.getConfigurationMarkup());

                // update the control:
                gridItem.data('control', control);

            }); 

            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //
            // get grid information and publish
            //  
            PubSub.subscribe('rcap:save', function(){ 
                var items = [], currentControl;

                $('.grid-stack-item[data-controlid]').each(function() {

                    currentControl = $(this).data('control');
                    items.push(currentControl);
                });

                PubSub.publish('rcap:serialize', items);
            });

            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //
            // open
            //  
            PubSub.subscribe('rcap:open', function(msg, items){ 

                // let's be sure :)
                var grid = $('.grid-stack').data('gridstack'), loop = 0, control;
                grid.remove_all(); // jshint ignore:line

                // add items to the grid:
                console.log('Gridmanager says thank for the items on rcap:open', items);

                // loop through the items and add them to the grid:
                for( ; loop < items.length; ++loop) {
                    
                    control = items[loop];



/*control.getConfigurationMarkup()*/
                    var newWidget = grid.add_widget($('<div data-controlid="' + control.id + '"><div class="grid-stack-item-content" data-gs-locked="true"><div class="configure">' +  // jshint ignore:line
                        control.getConfigurationMarkup() + 
                        '<p><button type="button" class="btn btn-default">Configure</button></p></div></div></div>'), control.x, control.y, control.width, control.height, false);  // jshint ignore:line

                    newWidget.data('control', control); 

                    grid.locked(newWidget, true); 

                }

            });

            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //
            // load
            //  
            PubSub.subscribe('rcap:close', function(){ 

                var grid = $('.grid-stack').data('gridstack');
                grid.remove_all(); // jshint ignore:line

            });


        }
    };
});
