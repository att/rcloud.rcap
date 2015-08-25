define([
    'controls/factories/controlFactory',
    'pubsub',
    'rcap/js/vendor/gridstack'
], function(ControlFactory, PubSub) {

    'use strict';

    var GridManager = function() {
        this.cellHeight = 80;
        this.verticalMargin = 20;
        this.minHeightCellCount = 12;
        this.id = 'GM-' + Math.random().toString(16).slice(2);
    };

    GridManager.prototype.initialise = function() {

        var selector = '#rcap-viewer .grid-stack';

        $(selector).gridstack({
            min_height_cellcount: this.minHeightCellCount, // jshint ignore:line
            cell_height: this.cellHeight, // jshint ignore:line
            vertical_margin: this.verticalMargin, // jshint ignore:line
            static_grid: true, // jshint ignore:line
            float: true
        });

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // open
        //  
        PubSub.subscribe('grid:viewer-init', function(msg, items) {

            console.log('rcap:open for view grid');

            var grid = $(selector).data('gridstack'),
                loop = 0;
            grid.remove_all(); // jshint ignore:line

            // add items to the grid:
            for (; loop < items.length; ++loop) {

                var newWidget = grid.add_widget($('<div data-gs-readonly="true" data-gs-locked="true" data-gs-no-resize="true" data-gs-no-move="true"><div class="grid-stack-item-content">' + // jshint ignore:line
                    items[loop].render() + '</div></div>'), items[loop].x, items[loop].y, items[loop].width, items[loop].height, false); // jshint ignore:line

                grid.locked(newWidget, true);
            }
        });
    };

    GridManager.prototype.initialiseDesignGrid = function() {

        var me = this,
            selector = '#rcap-designer .grid-stack';

        me.controlFactory = new ControlFactory();

        $(selector).gridstack({
            min_height_cellcount: this.minHeightCellCount, // jshint ignore:line
            cell_height: this.cellHeight, // jshint ignore:line
            vertical_margin: this.verticalMargin, // jshint ignore:line
            animate: true,
            resizable: {
                handles: 'e, se, s'
            },
            float: true
        });

        $(selector).on('dragstop', function(event) {
            var element = $(event.target);
            var node = element.data('_gridstack_node');
            element.data('control').x = node.x;
            element.data('control').y = node.y;
        });

        $(selector).on('resizestop', function(event) {
            var element = $(event.target);
            var node = element.data('_gridstack_node');
            element.data('control').width = node.width;
            element.data('control').height = node.height;
        });

        $(selector).on('change', function() {
            var itemCount = $('.grid-stack-item[data-controlid]').length;

            //console.log('The number of widgets has changed to: ', itemCount);

            if (itemCount !== undefined) {
                if (itemCount === 0) {
                    $('#no-items').fadeTo(500, 1);
                } else {
                    $('#no-items').fadeTo(100, 0, function() {
                        $(this).hide(); // so that is(':visible') check returns true!
                    });
                }
            }
        });

        var grid = $(selector).data('gridstack');

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // draggable initiation
        //
        $('#controls li').draggable({
            revert: true,
            revertDuration: 0,
            appendTo: '.grid-stack',
            containment: '.grid-stack',
            start: function() {
                var control = me.controlFactory.getByKey($(this).data('type'));
                grid.init_placeholder(control.initialWidth(), control.initialHeight()); // jshint ignore:line

                if ($('#no-items').is(':visible')) {
                    $('#no-items').fadeTo(250, 0.1);
                }
            },
            drag: function(event, ui) {
                var cell = grid.get_cell_from_pixel(ui.helper.position()); // jshint ignore:line
                grid.position_placeholder(cell.x, cell.y); // jshint ignore:line
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
        // drop control onto grid
        //
        $(selector).droppable({
            accept: '#controls li',
            hoverClass: 'grid-stack-item',
            over: function(event, ui) {
                ui.helper.css('z-index', 9999);
            },
            drop: function(event, ui) {
                var grid = $(selector).data('gridstack');
                //var cell = grid.get_cell_from_pixel(ui.helper.position()); // jshint ignore:line
                var placeholderPosition = grid.get_placeholder_position(); // jshint ignore:line

                //console.info('placeholder pos: ', placeholderPosition);

                // get the type:
                var control = me.controlFactory.getByKey(ui.draggable.data('type'));

                var defaultWidth = control.initialWidth(),
                    defaultHeight = control.initialHeight();

                if (grid.is_area_empty(placeholderPosition.x, placeholderPosition.y, defaultWidth, defaultHeight)) { // jshint ignore:line

                    var newWidget = grid.add_widget($('<div data-controlid="' + control.id + '"><div class="grid-stack-item-content" data-gs-locked="true"><div class="configure">' + control.getConfigurationMarkup() + '<p><button type="button" class="btn btn-primary">Configure</button></p></div></div></div>'), placeholderPosition.x, placeholderPosition.y, defaultWidth, defaultHeight, false); // jshint ignore:line

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
            PubSub.publish('controlDialog:show', $(this).closest('.grid-stack-item').data('control'));
        });

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // update grid control after dialog update
        //
        PubSub.subscribe('controlDialog:updated', function(msg, control) {

            // update the control's data: 
            var gridItem = $('.grid-stack-item[data-controlid="' + control.id + '"]');

            // and get the new markup:
            gridItem.find('.configure p:first').html(control.getConfigurationMarkup());

            // update the control:
            gridItem.data('control', control);

        });

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // save
        //  
        PubSub.subscribe('rcap:save', function() {
            var items = [],
                currentControl;

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
        PubSub.subscribe('grid:designer-init', function(msg, items) {


console.log('rcap:open for design grid');


            var grid = $(selector).data('gridstack'),
                loop = 0,
                control;
            grid.remove_all(); // jshint ignore:line

            // add items to the grid:
            for (; loop < items.length; ++loop) {

                control = items[loop];

                var newWidget = grid.add_widget($('<div data-controlid="' + control.id + '"><div class="grid-stack-item-content" data-gs-locked="true"><div class="configure">' + // jshint ignore:line
                    control.getConfigurationMarkup() + '<p><button type="button" class="btn btn-primary">Configure</button></p></div></div></div>'), control.x, control.y, control.width, control.height, false); // jshint ignore:line

                newWidget.data('control', control);

                grid.locked(newWidget, true);

            }

            if (items.length === 0) {
                $('#no-items').show();
            }

        });

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // close
        //  
        PubSub.subscribe('rcap:close', function() {

            var grid = $(selector).data('gridstack');
            grid.remove_all(); // jshint ignore:line

            // other code will show it, but it needs to be hidden by default so it doesn't 
            // 'flash':
            $('#no-items').hide();

        });

    };

    return GridManager;
});
