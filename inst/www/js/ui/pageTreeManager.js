define([
    'rcap/js/utils/rcapLogger',
    'text!ui/templates/pageMenuItem.tpl',
    'pubsub',
    'site/pubSubTable'
], function(RcapLogger, pageMenuItemTemplate, PubSub, pubSubTable) {

    'use strict';

    var rcapLogger = new RcapLogger(),
        pagesTree;

    var PageTreeManager = Class.extend({
        init: function() {

        },
        initialise: function() {

            rcapLogger.info('PageTreeManager: initialise');

            //////////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            PubSub.subscribe(pubSubTable.updatePage, function(/*msg, pageObj*/) {
/*
                rcapLogger.info('menuManager: pubSubTable.updatePage');
                $('#pages li[data-pageid="' + pageObj.id + '"] .navigation-title:eq(0)').text(pageObj.navigationTitle);

                var pagesSelector = $('#pages li[data-pageid="' + pageObj.id + '"], #pages li[data-pageid="' + pageObj.id + '"] li');

                if (pageObj.isEnabled) {
                    pagesSelector.removeClass('not-enabled');
                } else {
                    pagesSelector.addClass('not-enabled');
                }
*/
            });

            //////////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            PubSub.subscribe(pubSubTable.deletePageConfirm, function(msg, pageId) {

                rcapLogger.info('pageTreeManager: pubSubTable.deletePageConfirm');

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

                rcapLogger.info('pageTreeManager: pubSubTable.initSite');

                var buildTree = function(pages/*, container*/) {
                    _.each(pages, function(item) {
                        pagesTree.tree('appendNode', {
                          name: item.navigationTitle,
                          id: item.id,
                          canAddChild: item.depth < 3
                        }, item.parentId ? pagesTree.tree('getNodeById', item.parentId) : null);
                    });
                };

                pagesTree = $('#pages-tree');

                var template = _.template(pageMenuItemTemplate);

                pagesTree.tree({
                  data: [],
                  // autoOpen doesn't work here because data is empty
                  onCreateLi: function(node, $li) {
                    $li.find('.jqtree-element').append(
                      template({
                        p: node
                      })
                    );
                  }
                });

                buildTree(site.pages);

                var tree = pagesTree.tree('getTree');
                    tree.iterate(
                    function(node) {
                        if (node.hasChildren()) {
                            pagesTree.tree('openNode', node);
                            return true;
                        }

                        return false;
                });

                // auto-select first page:
                pagesTree.tree('selectNode', pagesTree.tree('getNodeById', site.pages[0].id));

                // page click:
                pagesTree.bind('tree.select', function(e) {
                  if(e.node) {
                    rcapLogger.info('pageTreeManager: PUBLISH : pubSubTable.changeSelectedPageId');

                    $('.menu-flyout').hide();

                    // just the id:
                    PubSub.publish(pubSubTable.changeSelectedPageId, e.node.id);
                  }
                });

                PubSub.publish(pubSubTable.pageCountChanged, site.pages.length);
            });

            // PubSub.subscribe(pubSubTable.flyoutActivated, function(msg, msgData) {
            //     if(msgData.id === 'pages') {
            //         var tree = pagesTree.tree('getTree');
            //         tree.iterate(
            //           function(node) {
            //               if (node.hasChildren()) {
            //                   pagesTree.tree('openNode', node);
            //                   return true;
            //               }

            //               return false;
            //           });
            //     }
            // });

            //////////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            PubSub.subscribe(pubSubTable.close, function() {

            });

            //////////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            $('body').on('click', '#main-menu a[data-messageid]', function() {
                // hide all:
                $('.menu-flyout').hide();
                $('#main-menu li').removeClass('selected');

                // but this one isn't selected since it invokes something else:
                var message = $(this).attr('data-messageid');
                rcapLogger.info('pageTreeManager: pubSubTable dynamic: ' + message);
                PubSub.publish(pubSubTable[message]);
            });

            //////////////////////////////////////////////////////////////////////////////////////////
            //
            // click handler for add page:
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
            });

            //////////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            PubSub.subscribe(pubSubTable.pageAdded, function(msg, msgData) {

                rcapLogger.info('pageTreeManager: pubSubTable.addPage');

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

    return PageTreeManager;

});
