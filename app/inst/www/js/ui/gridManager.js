define([
    'controls/factories/controlFactory',
    'pubsub',
    'site/pubSubTable',
    'rcap/js/vendor/gridstack'
], function(ControlFactory, PubSub, pubSubTable) {

    'use strict';

    var GridManager = function() {
        this.cellHeight = 80;
        this.verticalMargin = 20;
        this.minHeightCellCount = 12;
        this.id = 'GM-' + Math.random().toString(16).slice(2);
    };

    var getDesignTimeControlOuterMarkup = function(control) {
        return $('<div data-controlid="' + control.id + '"></div>').append(getDesignTimeControlInnerMarkup(control));
    };

    var getDesignTimeControlInnerMarkup = function(control) {
        var outer = $('<div class="grid-stack-item-content ui-draggable-handle" data-gs-locked="true"><div class="configure"></div></div>');
        var configure = outer.find('.configure');

        if (!control.isValid()) {
            outer.addClass('invalid');
        } else {
            outer.addClass('valid');
            outer.append('<div class="valid-overlay"></div>');
            configure.append(control.render({
                'isDesignTime': true
            }));
        }

        // append button (and icon if the state is not valid):
        outer.append('<p>' +
            (control.isValid() ? '' : '<i class="config-icon icon-' + control.inlineIcon + '"></i>') +
            '<button type="button" class="btn btn-primary btn-configure">Configure</button></p>');

        return outer;

        /*
        return '<div class="grid-stack-item-content" data-gs-locked="true"><div class="configure">' + // jshint ignore:line
            '<p><i class="icon-' + control.inlineIcon + '"></i></p>' + '<p><button type="button" class="btn btn-primary">Configure</button></p></div></div>';

            */
    };

    //GridManager.prototype.

    var publishComplete = function() {
        setTimeout(function() {
            PubSub.publish('grid:initcomplete', {});
        }, 500);
    };


    var addGrid = function(pageId) {
        // 
        $('#inner-stage').append('<div class="grid-stack" data-pageid="' + pageId + '" data-gs-height="12"></div>');

        var selector = '.grid-stack[data-pageid="' + pageId + '"]';

        $(selector).gridstack({
            min_height_cellcount: 12, // jshint ignore:line
            cell_height: 80, // jshint ignore:line
            vertical_margin: 20, // jshint ignore:line
            static_grid: true, // jshint ignore:line
            float: true
        });
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////////////

    PubSub.subscribe(pubSubTable.initSite, function(msg, site) {

        console.info('gridManager: pubSubTable.initSite');

        // each page has its own grid:
        _.each(site.pages, function(page) {
            addGrid(page.id);
        });

        // initialise the grids:
        initialiseDesignGrids(_.pluck(site.pages, 'id'));

        // add controls:
        _.each(site.pages, function(page) {
            // get the current grid, based on the page id:
            var grid = $('.grid-stack[data-pageid="' + page.id + '"]').data('gridstack');

            grid.remove_all(); // jshint ignore:line

            // add items to the grid:
            _.each(page.controls, function(control) {
                var newWidget = grid.add_widget(getDesignTimeControlOuterMarkup(control), control.x, control.y, control.width, control.height, false); // jshint ignore:line

                newWidget.data('control', control);

                grid.locked(newWidget, true);
            });
        });
    });

    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    PubSub.subscribe('ui:' + pubSubTable.addPage, function(msg, page) {

        console.info('gridManager: pubSubTable.addPage');

        addGrid(page.id);
        initialiseDesignGrids([page.id]);

        // new page won't have any controls:
        $('#no-items').show().css({
            opacity: 1.0
        });
    });

    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    PubSub.subscribe(pubSubTable.changeSelectedPage, function(msg, page) {

        console.info('gridManager: pubSubTable.changeSelectedPage');

        $('.grid-stack').hide();
        $('.grid-stack[data-pageid="' + page.id + '"]').show();

        if (page.controls.length === 0) {
            $('#no-items').show();
            $('#no-items').css({
                opacity: 1.0
            });
        } else {
            $('#no-items').hide();
        }

    });

    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    PubSub.subscribe(pubSubTable.deletePageConfirm, function(msg, pageId) {

        console.info('gridManager: pubSubTable.deletePageConfirm');

        $('.grid-stack[data-pageid="' + pageId + '"]').remove();

        // select the first item:
        $('.grid-stack:eq(0)').show();
    });

    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    GridManager.prototype.initialise = function() {

    };

    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    var getGrid = function() {
        return $('.grid-stack:visible').data('gridstack');
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    var _initGrid = function(pageId) {
        var selector = '.grid-stack[data-pageid="' + pageId + '"]';

        $(selector).gridstack({

            min_height_cellcount: 12, // jshint ignore:line
            cell_height: 80, // jshint ignore:line
            vertical_margin: 20, // jshint ignore:line

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

            var hasItem = false,
                dataItems = [];

            $('.grid-stack-item:visible').each(function() {
                hasItem = true;

                if ($(this).data('control') !== undefined) {
                    dataItems.push(($(this).data('control')));
                }
            });

            if (!hasItem) {
                $('#no-items').fadeTo(500, 1);
            } else {
                $('#no-items').fadeTo(100, 0, function() {
                    $(this).hide(); // so that is(':visible') check returns true!
                });
            }

            // this is a bit belt and braces, but there are no events that are more granular than this
            // "something's changed" event:
            PubSub.publish(pubSubTable.gridItemsChanged, dataItems);

        });
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    var initialiseDesignGrids = function(pageIds) {

        //var me = this,
        var selector; // = '#rcap-designer .grid-stack';

        var controlFactory = new ControlFactory();

        _.each(pageIds, function(pageId) {
            _initGrid(pageId);
        });

        //var grid = $(selector).data('gridstack');


        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // draggable initiation
        //
        $('#main-menu .controls li').draggable({
            revert: true,
            revertDuration: 0,
            appendTo: '.grid-stack:visible',
            containment: '.grid-stack:visible',
            start: function() {

                var control = controlFactory.getByKey($(this).data('type'));

                getGrid().init_placeholder(control.initialWidth(), control.initialHeight()); // jshint ignore:line

                if ($('#no-items').is(':visible')) {
                    $('#no-items').fadeTo(250, 0.1);
                }
            },
            drag: function(event, ui) {
                var cell = getGrid().get_cell_from_pixel(ui.helper.position()); // jshint ignore:line
                getGrid().position_placeholder(cell.x, cell.y); // jshint ignore:line
            },
            stop: function() {
                getGrid().detach_placeholder(); // jshint ignore:line
            },
            helper: function() {
                return $('<div style="background-color: #ddd; width: 75px; height: 75px;">+</div>');
            }
        });

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // drop control onto grid
        //
        $('.grid-stack').droppable({
            accept: '#main-menu .controls li',
            hoverClass: 'grid-stack-item',
            over: function(event, ui) {
                ui.helper.css('z-index', 9999);
            },
            drop: function(event, ui) {

                var grid = getGrid();
                //var cell = grid.get_cell_from_pixel(ui.helper.position()); // jshint ignore:line
                var placeholderPosition = grid.get_placeholder_position(); // jshint ignore:line

                //console.info('placeholder pos: ', placeholderPosition);

                // get the type:
                var control = controlFactory.getByKey(ui.draggable.data('type'));

                var defaultWidth = control.initialWidth(),
                    defaultHeight = control.initialHeight();

                if (grid.is_area_empty(placeholderPosition.x, placeholderPosition.y, defaultWidth, defaultHeight)) { // jshint ignore:line

                    var newWidget = grid.add_widget(getDesignTimeControlOuterMarkup(control), placeholderPosition.x, placeholderPosition.y, defaultWidth, defaultHeight, false); // jshint ignore:line

                    // set the new element's control property:
                    control.x = +placeholderPosition.x;
                    control.y = +placeholderPosition.y;

                    newWidget.data('control', control);

                    // fire off that an item has been added:
                    PubSub.publish(pubSubTable.gridItemAdded, control);

                    grid.locked(newWidget, true);
                }
            }
        });


        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // configuration button click, show dialog:
        //
        $('body').on('click', '#inner-stage .btn-configure', function() {
            PubSub.publish(pubSubTable.configureControl, $(this).closest('.grid-stack-item').data('control'));
        });

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // update grid control after dialog update
        //
        PubSub.subscribe(pubSubTable.updateControl, function(msg, control) {

            console.info('gridManager: pubSubTable.updateControl');

            // update the control's data: 
            var gridItem = $('.grid-stack-item[data-controlid="' + control.id + '"] .grid-stack-item-content');

            // and get the new markup:
            gridItem.replaceWith(getDesignTimeControlInnerMarkup(control));

            // update the control:
            gridItem.data('control', control);

        });


        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
        $('body').on('click', '.ui-remove', function() {
            PubSub.publish(pubSubTable.showConfirmDialog, {
                heading: 'Delete control',
                message: 'Are you sure you want to delete this control?',
                pubSubMessage: pubSubTable.deleteControlConfirm,
                dataItem: $(this).closest('.grid-stack-item').data('controlid')
            });
        });


        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // delete grid control after dialog confirm
        //
        PubSub.subscribe(pubSubTable.deleteControlConfirm, function(msg, controlID) {
            var grid = $('.grid-stack:visible').data('gridstack');

            // find the item:
            var gridItem = $('.grid-stack-item[data-controlid="' + controlID + '"]');
            grid.remove_widget(gridItem, true);  // jshint ignore:line
        });

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // save
        //  
        // PubSub.subscribe('rcap:save', function() {
        //     var items = [],
        //         currentControl;

        //     $('.grid-stack-item[data-controlid]').each(function() {

        //         currentControl = $(this).data('control');
        //         items.push(currentControl);
        //     });

        //     PubSub.publish('rcap:serialize', items);
        // });

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // open
        //  
        PubSub.subscribe(pubSubTable.designerInit, function(msg, items) {

            console.info('gridManager: pubSubTable.designerInit');

            //console.log('rcap:open for design grid');

            var grid = $(selector).data('gridstack'),
                loop = 0,
                control;
            grid.remove_all(); // jshint ignore:line

            // add items to the grid:
            for (; loop < items.length; ++loop) {

                control = items[loop];

                var newWidget = grid.add_widget(getDesignTimeControlOuterMarkup(control), control.x, control.y, control.width, control.height, false); // jshint ignore:line

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
        PubSub.subscribe(pubSubTable.close, function() {

            console.info('gridManager: pubSubTable.close');

            $('.gridstack').each(function() {
                $(this).data('gridstack').remove_all(); // jshint ignore:line
            });


            //var grid = $(selector).data('gridstack');
            //grid.remove_all(); // jshint ignore:line

            // other code will show it, but it needs to be hidden by default so it doesn't 
            // 'flash':
            $('#no-items').hide();

        });

        //this.publishComplete();

        publishComplete();
    };

    return GridManager;
});
