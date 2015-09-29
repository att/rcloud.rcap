define([
    'pubsub',
    'site/pubSubTable',
    'controls/factories/controlFactory'
], function(PubSub, pubSubTable, ControlFactory) {

    'use strict';

    var controlFactory = new ControlFactory();

    // :::: TODO: refactor code below - both methods are very similar ::::

    var MenuManager = Class.extend({
        init: function() {

        },
        initialise: function() {

            console.info('MenuManager: initialise');

            var pageListItemMarkup = '<li class="js-rcap-dynamic" data-pageid="<%=p.id%>"><a href="#"><em class="navigation-title"><%=p.navigationTitle%></em> <span class="page-settings" title="Modify page settings">Settings</span></a></li>';

            //////////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            PubSub.subscribe('ui:' + pubSubTable.addPage, function(msg, page) {

                console.info('menuManager: pubSubTable.addPage');

                var template = _.template(pageListItemMarkup);
                $('#pages').append(template({
                    p: page
                }));

                // select the newly added page:
                $('#pages li[data-pageid="' + page.id + '"] a').trigger('click');
            });

            //////////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            PubSub.subscribe(pubSubTable.updatePage, function(msg, pageObj) {

                console.info('menuManager: pubSubTable.updatePage');

                $('#pages li[data-pageid="' + pageObj.id + '"] .navigation-title').text(pageObj.navigationTitle);
            });

            //////////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            PubSub.subscribe(pubSubTable.deletePageConfirm, function(msg, pageId) {

                console.info('menuManager: pubSubTable.deletePageConfirm');

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

                console.info('menuManager: pubSubTable.initSite');

                // do stuff with the site's pages:
                var templateStr = '<% _.each(pages, function(p){ %>' + pageListItemMarkup + '<% }); %>';
                var template = _.template(templateStr);
                $('#pages').html(template({
                    pages: site.pages
                }));

                // the first is as good as any:
                $('#pages a:eq(0)').trigger('click');
            });

            //////////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            PubSub.subscribe(pubSubTable.close, function() { 
                $('#pages li').remove();
            });


            $('body').on('click', '#page-header a', function() {
                PubSub.publish(pubSubTable.addPage, {});
            });

            // click handler for page:
            $('body').on('click', '#pages a', function() {
                $('#pages li').removeClass('selected');
                var li = $(this).closest('li');
                li.addClass('selected');

                console.info('menuManager: PUBLISH : pubSubTable.changeSelectedPageId');

                // just the id:
                PubSub.publish(pubSubTable.changeSelectedPageId, li.data('pageid'));
            });

            // sort 'em':
            $('#pages').sortable({
                containment: 'parent',
                update: function( /*event, ui*/ ) {

                    var pageIds = [];
                    $('#pages li').each(function() {
                        pageIds.push($(this).data('pageid'));
                    });

                    PubSub.publish(pubSubTable.changePageOrder, pageIds);
                }
            });

            // add styling info to the first page:
            $('#pages li:eq(0) a').trigger('click');

            return this;
        },
        initialiseControlsMenu: function() {
            var controls = controlFactory.getGridControls();
            var templateStr = '<% _.each(controls, function(control){ %><li data-type="<%=control.type%>"><a href="#" class="control-<%=control.type %>" title="Add <%=control.type%>"><%= control.label %></a></li><% }); %>';
            var template = _.template(templateStr);
            $('.menu .controls').append(template({
                controls: controls
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