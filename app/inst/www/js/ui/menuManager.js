define([
    'text!ui/templates/pageMenuItem.tpl',
    'pubsub',
    'site/pubSubTable',
    'controls/factories/controlFactory',
    //
    //  THIS OVERWRITES THE $.FN.SORTABLE FUNCTION, WHICH SPOILS THE FUN FOR EVERYONE ELSE.
    //  BEFORE UNCOMMENTING, AND USING FOR THE PAGE SORTING MENU, IT NEEDS TO BE ALIASED IN
    //  SOME WAY:
    //
    //'jquery-sortable'
], function(pageMenuItemTemplate, PubSub, pubSubTable, ControlFactory) {

    'use strict';

    var controlFactory = new ControlFactory();

    // :::: TODO: refactor code below - both methods are very similar ::::

    var MenuManager = Class.extend({
        init: function() {

        },
        initialise: function() {

            console.info('MenuManager: initialise');

            //////////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            PubSub.subscribe(pubSubTable.updatePage, function(msg, pageObj) {

                console.info('menuManager: pubSubTable.updatePage');
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

            //////////////////////////////////////////////////////////////////////////////////////////
            //
            // click handler for add page (both 'root' level and child):
            //
            $('body').on('click', '#page-header a, .page-addchild', function() {

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

                console.info('menuManager: pubSubTable.addPage');

                var template = _.template(pageMenuItemTemplate),
                    newPageMarkup = template({
                        p: msgData.page,
                        canAddChild: msgData.page.canAddChild()
                    });

                if (msgData.options.parentPageId) {
                    $('#pages li[data-pageid="' + msgData.options.parentPageId + '"]').children('ol').append(newPageMarkup);
                } else {
                    $('#pages').append(newPageMarkup);
                }

                // select the newly added page:
                $('#pages li[data-pageid="' + msgData.page.id + '"] a').trigger('click');
            });

            //////////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
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
            /*
            $('#pages').sortable({
                containment: 'parent',
                update: function() {

                    var pageIds = [];
                    $('#pages li').each(function() {
                        pageIds.push($(this).data('pageid'));
                    });

                    PubSub.publish(pubSubTable.changePageOrder, pageIds);
                }
            });*/

            /*var group = */


            // $('ol#pages').sortable({
            //     group: 'pages',
            //     delay: 500,
            //     // onDrop: function($item, container, _super) {
                    
            //     //     // var data = group.sortable('serialize').get();
            //     //     // var jsonString = JSON.stringify(data, null, '  ');

            //     //     // console.log(jsonString);

            //     //     // _super($item, container);
                    

            //     //     // determine the parent and the sibling of the moved item:
            //     //     var info = {
            //     //         movedItem: $item.data('pageid'),
            //     //         parent: $item.parent().closest('li').data('pageid'),
            //     //         previousSibling: $item.prev().data('pageid')
            //     //     };
            //     // }
            // });



            // add styling info to the first page:
            $('#pages li:eq(0) a').trigger('click');

            return this;
        },
        initialiseControlsMenu: function() {
            var controls = controlFactory.getGridControls();
            var templateStr = '<% _.each(controls, function(control){ %><li data-type="<%=control.type%>"><a href="#" class="control-<%=control.type %>" title="Add <%=control.type%>"><i class="icon-<%=control.icon%>"></i><%= control.label %></a></li><% }); %>';
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