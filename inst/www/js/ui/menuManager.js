define([
    'rcap/js/utils/rcapLogger',
    'text!ui/templates/pageMenuItem.tpl',
    'text!ui/templates/controlsMenu.tpl',
    'text!ui/templates/dataSourceMenuItem.tpl',
    'text!ui/templates/timerMenuItem.tpl',
    'text!ui/templates/siteSettingsMenu.tpl',
    'pubsub',
    'site/pubSubTable',
    'controls/factories/controlFactory'
], function(RcapLogger, pageMenuItemTemplate, controlsMenuTemplate, dataSourceMenuItemTemplate, timerMenuItemTemplate, siteSettingsMenuTemplate, PubSub, pubSubTable, ControlFactory) {

    'use strict';


    var controlFactory = new ControlFactory(),
        rcapLogger = new RcapLogger();

    // :::: TODO: refactor code below - both methods are very similar ::::

    var MenuManager = Class.extend({
        init: function() {

        },
        initialise: function() {

            rcapLogger.info('MenuManager: initialise');

            //////////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            PubSub.subscribe(pubSubTable.updatePage, function(msg, pageObj) {

                rcapLogger.info('menuManager: pubSubTable.updatePage');
                $('#pages li[data-pageid="' + pageObj.id + '"] .navigation-title:eq(0)').text(pageObj.navigationTitle);

                var pagesSelector = $('#pages li[data-pageid="' + pageObj.id + '"], #pages li[data-pageid="' + pageObj.id + '"] li');

                if (pageObj.isEnabled) {
                    pagesSelector.removeClass('not-enabled');
                } else {
                    pagesSelector.addClass('not-enabled');
                }

            });

            //////////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            PubSub.subscribe(pubSubTable.deletePageConfirm, function(msg, pageId) {

                rcapLogger.info('menuManager: pubSubTable.deletePageConfirm');

                $('#pages li[data-pageid="' + pageId + '"]').remove();

                // select the first item:
                $('#pages li').removeClass('selected');
                $('#pages li:eq(0)').addClass('selected');
            });

            //////////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            PubSub.subscribe(pubSubTable.initSite, function(msg, site) {

                rcapLogger.info('menuManager: pubSubTable.initSite');

                var buildTree = function(pages, container) {
                    _.each(pages, function(item) {

                        var template = _.template(pageMenuItemTemplate);
                        var markup = template({
                            p: item,
                            canAddChild: item.depth < 3
                        });

                        var newContainer = $(markup);

                        if (item.depth === 1) {
                            container.append(newContainer);
                        } else {
                            container.find('li[data-pageid="' + item.parentId + '"] ol:first').append(newContainer);
                        }
                    });
                };

                buildTree(site.pages, $('#pages'));

                // build the data sources:
                _.each(site.dataSources, function(dataSource) {
                    $('#dataSources').append(_.template(dataSourceMenuItemTemplate)({ ds : dataSource }));
                });

                // build the timers:
                _.each(site.timers, function(timer) {
                    $('#timers').append(_.template(timerMenuItemTemplate) ({ t : timer }));
                });

                //
                PubSub.publish(pubSubTable.pageCountChanged, site.pages.length);
                PubSub.publish(pubSubTable.dataSourceCountChanged, site.dataSources.length);
                PubSub.publish(pubSubTable.timerCountChanged, site.timers.length);

                // the first is as good as any:
                $('#pages a:eq(0)').trigger('click');
            });

            //////////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            PubSub.subscribe(pubSubTable.close, function() {
                $('#pages li, #dataSources li, #timers li').remove();
            });

            //////////////////////////////////////////////////////////////////////////////////////////
            //
            // flyout menu handler
            //
            $('body').on('click', '#main-menu a[data-flyoutid]', function() {
                // hide all:
                $('.menu-flyout').hide();
                $('#main-menu li').removeClass('selected');
                $(this).closest('li').addClass('selected');

                var menu = $('.menu-flyout[data-flyoutid="' + $(this).attr('data-flyoutid') + '"]');
                menu.show();

                PubSub.publish(pubSubTable.flyoutActivated, {
                    width: menu.width() + 40,
                    id: $(this).data('flyoutid')
                });
            });

            $('body').on('click', '.count', function() {
                $(this).prev().trigger('click');
            });

            $('body').on('click', '.menu-flyout a.panel-close', function() {
                $('.menu-flyout').hide();
                $('#main-menu li').removeClass('selected');
                var panelId = $(this).closest('.menu-flyout').data('flyoutid');

                PubSub.publish(pubSubTable.flyoutClosed, {
                    id: panelId
                });
            });

            PubSub.subscribe(pubSubTable.startControlDrag, function() {
                // hide all:
                $('.menu-flyout').hide();
            });

            //////////////////////////////////////////////////////////////////////////////////////////
            //
            // showPageFlyout event handler:
            //
            PubSub.subscribe(pubSubTable.showPageFlyout, function() {
                $('#main-menu a[data-flyoutid="pages"]').trigger('click');
            });

            //////////////////////////////////////////////////////////////////////////////////////////
            //
            // click handler for add page (both 'root' level and child):
            //
            $('body').on('click', '.menu-flyout[data-flyoutid="pages"] h4 a.add, .page-addchild', function() {

                var parentPageId;

                // child page:
                if ($(this).hasClass('page-addchild')) {
                    parentPageId = $(this).parent().closest('li').data('pageid');
                }

                PubSub.publish(pubSubTable.addPage, {
                    parentPageId: parentPageId
                });

                // verify that this a child can be added.
                // var maxLevels = $(this).closest('ol').data('maxlevels');
                //$(this).parent().siblings('ol').append('<li><a href="#">' + new Date().toString().substr(16, 8) + ' <span class="page-addchild">+</span></a> <ol></ol></li>');

            });

            //////////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            PubSub.subscribe(pubSubTable.pageAdded, function(msg, msgData) {

                rcapLogger.info('menuManager: pubSubTable.addPage');

                _.each(msgData.pageData, function(page) {

                    var template = _.template(pageMenuItemTemplate),
                        newPageMarkup = template({
                            p: page,
                            canAddChild: page.canAddChild()
                        });

                    if (page.parentId) {
                        $('#pages li[data-pageid="' + page.parentId + '"]').children('ol').append(newPageMarkup);
                    } else {
                        $('#pages').append(newPageMarkup);
                    }

                });

                // select the newly added page:
                $('#pages li[data-pageid="' + msgData.pageData[0].id + '"] a').trigger('click');
            });

            PubSub.subscribe(pubSubTable.pageCountChanged, function(msg, pageCount) {

                var countEl = $('#main-menu a[data-flyoutid="pages"]').find('.count');
                countEl.text(pageCount);

                if(pageCount === 0) {
                    countEl.fadeOut();
                } else {
                    countEl.fadeIn();
                }
            });

            //////////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            // click handler for page:
            $('body').on('click', '#pages a', function(e) {

                // ignore the span elements, which shouldn't invoke a change page:
                if(!$(e.target).is('span')) {
                    $('#pages li').removeClass('selected');
                    var li = $(this).closest('li');
                    li.addClass('selected');

                    rcapLogger.info('menuManager: PUBLISH : pubSubTable.changeSelectedPageId');

                    $('.menu-flyout').hide();

                    // just the id:
                    PubSub.publish(pubSubTable.changeSelectedPageId, li.data('pageid'));
                }

            });

            // data sources:
            $('body').on('click', '.menu-flyout[data-flyoutid="datasources"] h4 a.add', function() {
                rcapLogger.info('menuManager: pubSubTable.addDataSource');

                PubSub.publish(pubSubTable.addDataSource);
            });

            PubSub.subscribe(pubSubTable.dataSourceAdded, function(msg, dataSource) {
                rcapLogger.info('menuManager: pubSubTable.dataSourceAdded');

                // add the data source to the menu:
                var template = _.template(dataSourceMenuItemTemplate),
                    newItemMarkup = template({
                        ds : dataSource
                    });

                $('#dataSources').append(newItemMarkup);

            });

            PubSub.subscribe(pubSubTable.updateDataSource, function(msg, dataSource) {

                rcapLogger.info('menuManager: pubSubTable.updateDataSource');
                
                // find the item in the menu and update:
                var existingItem = $('#dataSources li[data-datasourceid="' + dataSource.id + '"]');

                var template = _.template(dataSourceMenuItemTemplate),
                    newItemMarkup = template({
                        ds : dataSource
                    });

                existingItem.replaceWith(newItemMarkup);
            });

            PubSub.subscribe(pubSubTable.deleteDataSourceConfirm, function(msg, dataSourceId) {

                rcapLogger.info('menuManager: pubSubTable.deleteDataSourceConfirm');

                $('#dataSources li[data-datasourceid="' + dataSourceId + '"]').remove();
            });

            PubSub.subscribe(pubSubTable.dataSourceCountChanged, function(msg, dataSourceCount) {

                var countEl = $('#main-menu a[data-flyoutid="datasources"]').find('.count');
                countEl.text(dataSourceCount);

                if(dataSourceCount === 0) {
                    countEl.fadeOut();
                } else {
                    countEl.fadeIn();
                }
            });

            // timers:
            $('body').on('click', '.menu-flyout[data-flyoutid="timers"] h4 a.add', function() {
                console.info('menuManager: pubSubTable.addTimer');

                PubSub.publish(pubSubTable.addTimer);
            });

            PubSub.subscribe(pubSubTable.timerAdded, function(msg, timer) {
                console.info('menuManager: pubSubTable.timerAdded');

                // add the data source to the menu:
                var template = _.template(timerMenuItemTemplate),
                    newItemMarkup = template({
                        t : timer
                    });

                $('#timers').append(newItemMarkup);

            });

            PubSub.subscribe(pubSubTable.updateTimer, function(msg, timer) {

                console.info('menuManager: pubSubTable.updateTimer');
                
                // find the item in the menu and update:
                var existingItem = $('#timers li[data-timerid="' + timer.id + '"]');

                var template = _.template(timerMenuItemTemplate),
                    newItemMarkup = template({
                        t : timer
                    });

                existingItem.replaceWith(newItemMarkup);
            });

            PubSub.subscribe(pubSubTable.deleteTimerConfirm, function(msg, timerId) {

                console.info('menuManager: pubSubTable.deleteTimerConfirm');

                $('#timers li[data-timerid="' + timerId + '"]').remove();
            });

            PubSub.subscribe(pubSubTable.timerCountChanged, function(msg, timerCount) {

                var countEl = $('#main-menu a[data-flyoutid="timers"]').find('.count');
                countEl.text(timerCount);

                if(timerCount === 0) {
                    countEl.fadeOut();
                } else {
                    countEl.fadeIn();
                }
            });

            // themes:
            PubSub.subscribe(pubSubTable.showThemeEditorDialog, function() {
                $('.menu-flyout').hide();
            });

            //////////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            // theme:
            // apply:
            $('body').on('click', '.settings-menu button', function() {
                rcapLogger.info('menuManager: pubSubTable.editTheme');
                PubSub.publish(pubSubTable.editTheme);
            });

            $('body').on('change', '.settings-menu select', function() {
                rcapLogger.info('menuManager: pubSubTable.gridSettingsUpdated');
                PubSub.publish(pubSubTable.gridSettingsUpdated, +$(this).val());
            });

            return this;
        },
        initialiseControlsMenu: function() {

            ///////////////////////////////////////////////////////////////////////////////////////////
            var categorisedControls = controlFactory.getGridControlsByCategory();
            //var controls = controlFactory.getGridControls();

            //var templateStr = '<% _.each(controls, function(control){ %><li data-type="<%=control.type%>"><a href="#" class="control-<%=control.type %>" title="Add <%=control.label%>"><i class="icon-<%=control.icon%>"></i><p><%= control.label %></p></a></li><% }); %>';
            var template = _.template(controlsMenuTemplate);
            $('.menu-flyout[data-flyoutid="controls"]').append(template({
                controlCategories: categorisedControls
            }));

            return this;
        },
        initialiseSettingsMenu: function() {

            var template = _.template(siteSettingsMenuTemplate);

            $('.menu-flyout[data-flyoutid="settings"]').append(template({

            }));

            return this;
        },
        getPages: function() {
            // get the page items:
            var pages = [];
            $('#pages li').each(function() {
                pages.push($(this).data('pageid'));
            });
            return pages;
        }
    });

    return MenuManager;

});
