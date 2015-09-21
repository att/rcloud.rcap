define([
    'controls/factories/controlFactory',
    'pubsub',
    'site/pubSubTable',
    'rcap/js/vendor/gridstack'
], function(ControlFactory, PubSub, pubSubTable) {

    'use strict';

    var GridManager = function() {
        // this.cellHeight = 80;
        // this.verticalMargin = 20;
        // this.minHeightCellCount = 12;
        // this.id = 'GM-' + Math.random().toString(16).slice(2);
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
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    var addGrid = function(pageId, options) {

        options = options || {};
        var selector = '.grid-stack[data-pageid="' + pageId + '"]';

        $('#inner-stage').append('<div class="grid-stack" data-pageid="' + pageId + '" data-gs-height="' + (options.minHeight || 12) + '"></div>');

        $(selector).gridstack({
            animate: true,
            resizable: {
                handles: 'e, se, s'
            },
            min_height_cellcount: options.minHeight || 12, // jshint ignore:line
            cell_height: options.cellHeight || 80, // jshint ignore:line
            vertical_margin: options.verticalMargin || 20, // jshint ignore:line
            static_grid: options.staticGrid || true, // jshint ignore:line
            float: options.float || true,
            height: options.minHeight || 12
        });

        if(options.isGlobalPageItem) { // header or footer
            $(selector).addClass('js-gridstack-global');
        }

        $(selector).off('dragstop').on('dragstop', function(event) {
            var element = $(event.target);
            var node = element.data('_gridstack_node');
            element.data('control').x = node.x;
            element.data('control').y = node.y;
        });

        $(selector).off('resizestop').on('resizestop', function(event) {
            var element = $(event.target);
            var node = element.data('_gridstack_node');
            element.data('control').width = node.width;
            element.data('control').height = node.height;
        });

        $(selector).off('change').on('change', function() {

            // don't fire an event if this grid hasn't been initialised
            if ($('.grid-stack:visible').hasClass('initialised')) {

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

                PubSub.publish(pubSubTable.gridItemsChanged, dataItems);
            }

        });

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // drop control onto grid
        //
        $(selector).droppable({
            accept: '#main-menu .controls li',
            hoverClass: 'grid-stack-item',
            over: function(event, ui) {
                ui.helper.css('z-index', 9999);
            },
            drop: function(event, ui) {

                var grid = getVisibleGrid(),
                    placeholderPosition = grid.get_placeholder_position(), // jshint ignore:line
                    control = new ControlFactory().getByKey(ui.draggable.data('type')),
                    defaultWidth = control.initialWidth(),
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
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    var getVisibleGrid = function() {
        return $('.grid-stack:visible').data('gridstack');
    };


    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    GridManager.prototype.initialise = function() {

        var controlFactory = new ControlFactory();

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // draggable initiation
        //
        $('#main-menu .controls li').draggable({
            revert: true,
            revertDuration: 0,
            appendTo: '.grid-stack:not(.js-gridstack-global):visible',
            containment: '.grid-stack:not(.js-gridstack-global):visible',
            start: function() {

                var control = controlFactory.getByKey($(this).data('type'));

                getVisibleGrid().init_placeholder(control.initialWidth(), control.initialHeight()); // jshint ignore:line

                if ($('#no-items').is(':visible')) {
                    $('#no-items').fadeTo(250, 0.1);
                }
            },
            drag: function(event, ui) {
                var cell = getVisibleGrid().get_cell_from_pixel(ui.helper.position()); // jshint ignore:line
                getVisibleGrid().position_placeholder(cell.x, cell.y); // jshint ignore:line
            },
            stop: function() {
                getVisibleGrid().detach_placeholder(); // jshint ignore:line
            },
            helper: function() {
                return $('<div style="background-color: #ddd; width: 75px; height: 75px;"></div>');
            }
        });

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //$('body').off('click').on('click', '.ui-remove', function() {
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
        // configuration button click, show dialog:
        //
        //$('body').off('click').on('click', '.btn-configure', function() {
        $('body').on('click', '.btn-configure', function() {

            console.info('gridManager: PUBLISH : pubSubTable.configureControl');

            PubSub.publish(pubSubTable.configureControl, $(this).closest('.grid-stack-item').data('control'));
        });

        /////////////////////////////////////////////////////////////////////////////////////////////////////////
        PubSub.subscribe(pubSubTable.initSite, function(msg, site) {

            console.info('gridManager: pubSubTable.initSite');

            //addGrid('header', { minHeight: 2, isGlobalPageItem : true });

            // each page has its own grid:
            _.each(site.pages, function(page) {
                addGrid(page.id);
            });

            //addGrid('footer', { minHeight: 2, isGlobalPageItem : true });

            // add controls:
            _.each(site.pages, function(page) {
                // get the current grid, based on the page id:
                var selector = $('.grid-stack[data-pageid="' + page.id + '"]');
                var grid = selector.data('gridstack');

                // add items to the grid:
                _.each(page.controls, function(control) {
                    var newWidget = grid.add_widget(getDesignTimeControlOuterMarkup(control), control.x, control.y, control.width, control.height, false); // jshint ignore:line

                    newWidget.data('control', control);

                    grid.locked(newWidget, true);
                });

                // has now been initialised, so any further changes to the grid's 
                // items will result in a publish of a 'changed' event:
                selector.addClass('initialised');

            });

            // publish an event signalling that the grid's have finished processing their data:
            PubSub.publish(pubSubTable.gridInitComplete);
        });

        /////////////////////////////////////////////////////////////////////////////////////////////////////////
        PubSub.subscribe('ui:' + pubSubTable.addPage, function(msg, page) {

            console.info('gridManager: pubSubTable.addPage');

            addGrid(page.id);

            // new page won't have any controls:
            $('#no-items').show().css({
                opacity: 1.0
            });
        });

        /////////////////////////////////////////////////////////////////////////////////////////////////////////
        PubSub.subscribe(pubSubTable.changeSelectedPage, function(msg, page) {

            console.info('gridManager: pubSubTable.changeSelectedPage');

            // hide all (individual page) grid stacks and the 'no items' - which will be shown if there are no items:
            $('.grid-stack:not(.js-gridstack-global), #no-items').hide();
            $('.grid-stack[data-pageid="' + page.id + '"]').show();

            if (page.controls.length === 0) {

                // append to the specific gridstack:
                $('#no-items').remove().appendTo('.grid-stack:not(.js-gridstack-global):visible').show().css({
                    opacity : 1.0
                });
            }

        });

        /////////////////////////////////////////////////////////////////////////////////////////////////////////
        PubSub.subscribe(pubSubTable.deletePageConfirm, function(msg, pageId) {

            console.info('gridManager: pubSubTable.deletePageConfirm');

            $('.grid-stack[data-pageid="' + pageId + '"]').remove();

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
        //
        // delete grid control after dialog confirm
        //
        PubSub.subscribe(pubSubTable.deleteControlConfirm, function(msg, controlID) {
            var grid = $('.grid-stack:visible').data('gridstack');

            // find the item:
            var gridItem = $('.grid-stack-item[data-controlid="' + controlID + '"]');
            grid.remove_widget(gridItem, true); // jshint ignore:line
        });

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // close
        //  
        PubSub.subscribe(pubSubTable.close, function() {
            console.info('gridManager: pubSubTable.close');
            $('.grid-stack').remove();
            $('#no-items').hide();
        });

    };

    return GridManager;
});
