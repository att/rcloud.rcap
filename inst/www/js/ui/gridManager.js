define([
    'controls/factories/controlFactory',
    'pubsub',
    'site/pubSubTable',
    'rcap/js/utils/rcapLogger',
    'rcap/js/vendor/gridstack'
], function(ControlFactory, PubSub, pubSubTable, RcapLogger) {

    'use strict';

    var rcapLogger = new RcapLogger();

    var GridManager = function() {

    };

    var getDesignTimeControlOuterMarkup = function(control) {
        return $('<div data-controlid="' + control.id + '"></div>').append(getDesignTimeControlInnerMarkup(control));
    };

    var getDesignTimeControlInnerMarkup = function(control) {
        var outer = $('<div class="grid-stack-item-content rcap-controltype-' + control.type + ' ui-draggable-handle"><div class="configure"></div></div>');
        var configure = outer.find('.configure');

        if (!control.isValid()) {
            outer.addClass('invalid');
        } else {
            outer.addClass('valid');

            outer.addClass(control.getCssClass());

            //outer.append('<div class="valid-overlay"></div>');
            configure.append(control.render({
                isDesignTime: true
            }));

            // only apply styling information if the control is in a valid state:
            configure.css(control.getStyleProperties());
        }

        // append button (and icon if the state is not valid):
        outer.append('<p style="margin-bottom:0">' +
            (control.isValid() ? '' : '<i class="config-icon icon-' + control.icon + '"></i>') +
            '<button type="button" class="btn btn-primary btn-configure"><i class="icon-cog"></i></button></p>');

        return outer;
    };

    var getViewerControlMarkup = function(control) {

        var item = $('<div data-controlid="' + control.id + '" data-gs-no-resize="true" data-gs-no-move="true" data-gs-readonly="true"></div>')
            .append('<div class="grid-stack-item-content rcap-controltype-' + control.type + '"></div>');

        item.find('.grid-stack-item-content')
            .css(control.getStyleProperties())
            .addClass(control.getCssClass())
            .append(control.render());

        return item;

    };

    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    var addGrid = function(page, options) {

        options = options || {};
        var selector = '.grid-stack[data-pageid="' + page.id + '"]',
            rootElement = '#inner-stage',
            gridstackOptions = {};

        if (options.isDesignTime === undefined) {
            options.isDesignTime = true;
        }

        if (options.isDesignTime) {
            gridstackOptions.animate = true;
            gridstackOptions.resizable = {
                handles: 'e, se, s'
            };
            gridstackOptions.animate = true;
        } else {
            gridstackOptions.static_grid = true; // jshint ignore:line
        }

        gridstackOptions.float = options.float || true;
        gridstackOptions.min_height_cellcount = options.minHeightCellcount || 48; // jshint ignore:line
        gridstackOptions.cell_height = options.cellHeight || 40; // jshint ignore:line
        gridstackOptions.vertical_margin = options.verticalMargin || 20; // jshint ignore:line
        gridstackOptions.static_grid = options.staticGrid || true; // jshint ignore:line
        gridstackOptions.height = options.height || 48;   // 0 -> no maximum rows

        var gridStackRoot = $('<div class="grid-stack" ' + 
            'data-user="' + $('body').data('user') +
            '" data-nodename="' + $('body').data('nodename') + 
            '" data-nodenameusername="' + $('body').data('nodenameusername') + 
            '" data-pageid="' + page.id + 
            '" data-gs-height="' + (options.minHeight || 12) + 
            '" data-gs-width="24"></div>');

        if (options.isGlobalPageItem) { // header or footer
            gridStackRoot.addClass('js-gridstack-global');
        }

        if (!options.isDesignTime) {
            gridStackRoot.addClass('grid-stack-readonly');
        }

        $(rootElement).append(gridStackRoot);

        $(selector).gridstack(gridstackOptions);

        // designer events:
        if (options.isDesignTime) {

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
                accept: '.menu-flyout .controls li',
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
                        control.isOnGrid = true;

                        newWidget.data('control', control);

                        // fire off that an item has been added:
                        PubSub.publish(pubSubTable.gridItemAdded, control);

                        grid.locked(newWidget, true);
                    }
                }
            });
        }

        var $selector = $(selector);
        var grid = $selector.data('gridstack');

        // add items to the grid:
        _.each(page.controls, function(control) {

            var newWidget = grid.add_widget( // jshint ignore:line

                options.isDesignTime ? getDesignTimeControlOuterMarkup(control) : getViewerControlMarkup(control),
                control.x,
                control.y,
                control.width,
                control.height,
                false); // jshint ignore:line

            newWidget.data('control', control);

            grid.locked(newWidget, true);

        });

        // has now been initialised, so any further changes to the grid's 
        // items will result in a publish of a 'changed' event:
        $selector.addClass('initialised');

    };

    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    var getVisibleGrid = function() {
        return $('.grid-stack:visible').data('gridstack');
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    GridManager.prototype.initialise = function(options) {

        options = options || {};

        if (options.isDesignTime === undefined) {
            this.isDesignTime = true;
        } else {
            this.isDesignTime = options.isDesignTime;
        }

        var controlFactory = new ControlFactory();

        if (this.isDesignTime) {
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //
            // draggable initiation
            //
            $('.menu-flyout .controls li').draggable({
                revert: true,
                revertDuration: 0,
                appendTo: '.grid-stack:not(.js-gridstack-global):visible',
                containment: '.grid-stack:not(.js-gridstack-global):visible',
                start: function() {

                    // fire off an event:
                    PubSub.publish(pubSubTable.startControlDrag);
                    
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

                rcapLogger.info('gridManager: PUBLISH : pubSubTable.configureControl');

                PubSub.publish(pubSubTable.configureControl, $(this).closest('.grid-stack-item').data('control'));
            });


            /////////////////////////////////////////////////////////////////////////////////////////////////////////
            PubSub.subscribe(pubSubTable.updatePage, function(msg, pageData) {

                $('.grid-stack[data-pageid="' + pageData.id + '"]').css('background-color', _.findWhere(pageData.styleProperties, { uid : 'backgroundColor' }).value);

            });
            
            /////////////////////////////////////////////////////////////////////////////////////////////////////////
            PubSub.subscribe(pubSubTable.pageAdded, function(msg, pageData) {

                rcapLogger.info('gridManager: pubSubTable.pageAdded');

                _.each(pageData.pageData, function(page) {
                    addGrid(page);
                });

                // new page won't have any controls:
                $('#no-items').show().css({
                    opacity: 1.0
                });

            });

            /////////////////////////////////////////////////////////////////////////////////////////////////////////
            PubSub.subscribe(pubSubTable.deletePageConfirm, function(msg, pageId) {

                rcapLogger.info('gridManager: pubSubTable.deletePageConfirm');

                $('.grid-stack[data-pageid="' + pageId + '"]').remove();

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
        }

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // update grid control after dialog update
        //
        PubSub.subscribe(pubSubTable.updateControl, function(msg, control) {

            rcapLogger.info('gridManager: pubSubTable.updateControl');

            // update the control's data, depending on whether the grid is in design mode:
            var item = $('.grid-stack-item[data-controlid="' + control.id + '"]');
            var itemGrid = item.closest('.grid-stack');

            if (itemGrid.hasClass('grid-stack-readonly')) {
                //item.find('.grid-stack-item-content').html(data.markup);

                item.find('.grid-stack-item-content')
                    .html(control.render())
                    .addClass(control.getCssClass());

                //if(control.getCssClass()) {
                //    item.addClass(control.getCssClass());
                //}

            } else {

                // update the control's data: 
                var gridItem = $('.grid-stack-item[data-controlid="' + control.id + '"] .grid-stack-item-content');

                // and get the new markup:
                gridItem.replaceWith(getDesignTimeControlInnerMarkup(control));

                // update the control:
                gridItem.data('control', control);

            }
        });

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // update grid control after dialog update
        //
        PubSub.subscribe(pubSubTable.pagesChanged, function( /*msg, data*/ ) {

            rcapLogger.info('gridManager: pubSubTable.pagesChanged');

        });

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // update grid control after dialog update
        //
        PubSub.subscribe(pubSubTable.updateControlMarkup, function(msg, data) {

            rcapLogger.info('gridManager: pubSubTable.updateControlMarkup');

            // update the control's data, depending on whether the grid is in design mode:
            var item = $('.grid-stack-item[data-controlid="' + data.controlId + '"]');
            var itemGrid = item.closest('.grid-stack');

            if (itemGrid.hasClass('grid-stack-readonly')) {
                item.find('.grid-stack-item-content').html(data.markup);
            } else {
                // this is design mode, so use the utility method:
                item.find('.configure').html(data.markup);
            }
        });

        /////////////////////////////////////////////////////////////////////////////////////////////////////////
        PubSub.subscribe(pubSubTable.initSite, function(msg, site) {

            rcapLogger.log('gridManager: pubSubTable.initSite');

            // each page has its own grid:
            _.each(site.pages, function(page) {
                addGrid(page, {
                    isDesignTime: site.isDesignTime,
                    height: 48
                });
            });

            // publish an event signalling that the grids have finished processing their data:
            PubSub.publish(pubSubTable.gridInitComplete);
        });

        /////////////////////////////////////////////////////////////////////////////////////////////////////////
        PubSub.subscribe(pubSubTable.viewerShowFirstPage, function() {
            // all shown at this point, for plot sizes (need to be visible for the size to work)
            // hide all but the first:
            $('.grid-stack:not(:eq(0))').hide();
        });

        /////////////////////////////////////////////////////////////////////////////////////////////////////////
        PubSub.subscribe(pubSubTable.show404, function() {
            $('.grid-stack').hide();
        });

        /////////////////////////////////////////////////////////////////////////////////////////////////////////
        PubSub.subscribe(pubSubTable.changeSelectedPage, function(msg, page) {

            rcapLogger.info('gridManager: pubSubTable.changeSelectedPage');

            // hide all (individual page) grid stacks and the 'no items' - which will be shown if there are no items:
            $('.grid-stack:not(.js-gridstack-global), #no-items').hide();
            $('.grid-stack[data-pageid="' + page.id + '"]').show();


            console.log('I want to move it to: ', 
                $('.grid-stack[data-pageid="' + page.id + '"]')
            );


            if (page.controls.length === 0) {

                $('#no-items').appendTo('.grid-stack[data-pageid="' + page.id + '"]').show().css({
                    opacity: 1.0
                });
            }

            window.scrollTo(0,0);

            PubSub.publish(pubSubTable.gridPageChangeComplete);

        });

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // close
        //  
        PubSub.subscribe(pubSubTable.close, function() {
            rcapLogger.info('gridManager: pubSubTable.close');
            $('#no-items').appendTo('#inner-stage');
            $('#inner-stage .grid-stack').remove();
        });

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // close viewer
        //  
        PubSub.subscribe(pubSubTable.closeViewer, function() {
            rcapLogger.info('gridManager: pubSubTable.closeViewer');
            $('#inner-stage .grid-stack').remove();
        });
    };

    GridManager.prototype.setGridSize = function(options) {

        var stageCss = {};

        // width, height, align
        stageCss.width = (options && options.width ? options.width : (screen.width - 20).toString()) + 'px';

        // no default for height:
        if(options && options.height) {
            stageCss.height = options.height + 'px';
        }

        if(!options || (options && options.align === 'center')) {
            stageCss['margin-left'] = 'auto';
            stageCss['margin-right'] = 'auto';
        } else if(options && options.align) {
            switch(options.align) {
                case 'left':
                    stageCss['margin-left'] = '0';
                    break;
                case 'right':
                    stageCss['margin-right'] = '0';
                    break;
            }
        }

        $('#inner-stage').css(stageCss);
    };

    return GridManager;
});
