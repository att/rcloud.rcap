define([], function() {

    'use strict';

    return function(pages) {

        this.findPage = function(pageId) {
            return _.findWhere(pages, {
                id: pageId
            });
        };

        this.getDescendantsAndSelf = function(rootPageId) {

            var traversedPages = [];

            var walkPages = function(subsetOfPages) {

                _.each(subsetOfPages, function(p) {

                    traversedPages.push(p);

                    var childPages = _.filter(pages, function(sp) {
                        return sp.parentId === p.id;
                    });

                    if (childPages.length > 0) {
                        walkPages(childPages);
                    }
                });
            };

            walkPages(_.filter(pages, function(p) {
                return rootPageId ? p.id === rootPageId : !p.parentId;
            }));

            return traversedPages;

        };

        this.getAncestorsAndSelf = function(pageId) {

            var foundPage, treeItems = [];

            do {
                foundPage = _.findWhere(pages, {
                    id: pageId
                });
                pageId = foundPage.parentId;

                treeItems.unshift(foundPage);

            } while (foundPage && pageId);

            return treeItems;
        };

        this.removePage = function(pageId) {

            var pageIds = _.pluck(this.getDescendantsAndSelf(pageId), 'id');

            return _.filter(pages, function(p) {
                return pageIds.indexOf(p.id) === -1;
            });
        };

        this.setPageEnabledStatus = function(pageId, isEnabled) {

            _.each(this.getDescendantsAndSelf(), function(p) {
                p.isEnabled = isEnabled;
            });

        };

    };

});
