define([
    'rcap/js/vendor/gridstack'
], function() {

    'use strict';

    return {

        initialise: function() {
            $('.grid-stack').on('click', function(e) {

                $('.grid-stack-item-content').removeClass('selected');

                var $clicked = $($(e.target)[0]);

                // if this is an item, add the class to this specific item:
                if ($clicked.hasClass('grid-stack-item-content')) {
                    $clicked.addClass('selected');
                } else if ($clicked.hasClass('grid-stack')) {
                    console.log('grid stack has been clicked!');
                }
            });

            // window.onbeforeunload = function(e) {
            //     return 'You have pending unsaved changes. Do you really want to discard them?';
            // }

            var options = {
                cell_height: 80, // jshint ignore:line
                vertical_margin: 10, // jshint ignore:line
                //float: true,
                animate: true,
                //height: 10,
                resizable: {
                    handles: 'e, se, s'
                } //,
                // always_show_resize_handle: true
            };

            $('.grid-stack').gridstack(options);

            $('#serialize').click(function() {
                //var res =
                _.map($('.grid-stack .grid-stack-item:visible'), function(el) {
                    el = $(el);
                    var node = el.data('_gridstack_node');
                    return {
                        id: el.attr('data-custom-id'),
                        x: node.x,
                        y: node.y,
                        width: node.width,
                        height: node.height
                    };
                });
                //console.info("Serialized: ", JSON.stringify(res));
            });

            // delete selected item:
            $('html').keyup(function(e) {
                if (e.keyCode === 46) {
                    var $selectedItem = $('.grid-stack-item-content.selected + .ui-remove');

                    if ($selectedItem.length === 1) {
                        $($selectedItem[0]).trigger('click');
                    }
                }
            });

            var tempGrid = $('.grid-stack').data('gridstack');

            $('#controls li').draggable({
                revert: true,
                revertDuration: 0,
                appendTo: '.grid-stack',
                containment: '.grid-stack',
                start: function() {
                    tempGrid.init_placeholder(); // jshint ignore:line
                },
                drag: function(event, ui) {
                    var cell = tempGrid.get_cell_from_pixel(ui.helper.position()); // jshint ignore:line
                    tempGrid.position_placeholder(cell.x, cell.y); // jshint ignore:line
                },
                stop: function() {
                    tempGrid.detach_placeholder(); // jshint ignore:line
                },
                helper: function() {
                    return $('<div style="background-color: #ddd; width: 240px; height: 75px;"">+</div>');
                }
            });

            $('.grid-stack').droppable({
                accept: '#controls li',
                activeClass: 'placeholder-content',
                hoverClass: 'placeholder-content',
                over: function(event, ui) {
                    ui.helper.css('z-index', 9999);
                },
                drop: function(event, ui) {
                    var grid = $('.grid-stack').data('gridstack');
                    var cell = grid.get_cell_from_pixel(ui.helper.position()); // jshint ignore:line
                    if (grid.is_area_empty(cell.x, cell.y, 2, 1)) { // jshint ignore:line
                        var new_element = grid.add_widget($('<div><div class="grid-stack-item-content" data-gs-locked="true"><button>Configure</button></div></div>'), cell.x, cell.y, 2, 1, false); // jshint ignore:line
                        grid.locked(new_element, true); // jshint ignore:line
                    }
                }
            });
        }
    };

});
