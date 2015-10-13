define(['pages/page', 'rcap/js/utils/pageWalker'], function(Page, PageWalker) {

    'use strict';

    var Site = Class.extend({

        init: function(options) {
            options = options || {};

            this.saveTicks = options.saveTicks;
            this.isDesignTime = options.isDesignTime;

            // initialise with a single page:
            this.pages = options.pages || [
                new Page({
                    navigationTitle: 'Home'
                }),
            ];

            this.currentPageID = this.pages.length > 0 ? this.pages[0].id : undefined;
        },

        save: function() {
            this.saveTicks = new Date().getTime();
        },

        toJSON: function() {

            return {
                'saveTicks': this.saveTicks,
                'pages': this.pages
            };

        },

        createPage: function(options) {

            options = options || {};
            var newPage = new Page(options);

            if (options.parentPageId) {

                var parentPage = _.findWhere(this.pages, { id : options.parentPageId });

                if(parentPage) {
                    newPage.depth = parentPage.depth + 1;
                    newPage.parentId = parentPage.id;
                }

            } 

            return newPage;
        },
        /*
        addPage: function(page, options) {

            options = options || {};

            if (options.parentPageId) {

                //var parentPage = findPage(this.pages, options.parentPageId);
                var parentPage = new PageWalker().findPage(this.pages, function(p) { 
                    return p.id === options.parentPageId;
                });

                parentPage.addChildPage(page);

            } else {
                // no parent page, so just push to the root level pages:
                this.pages.push(page);
            }

            return this;
        },
        */
        updatePage: function(pageObj) {
            var page = this.getPageByID(pageObj.id);
            page.navigationTitle = pageObj.navigationTitle;

            page.setEnabledStatus(pageObj.isEnabled);
            //page.pageTitle = pageObj.title;
            //page.urlSlug = pageObj.urlSlug;

            return this;
        },

        updatePageOrder: function(pageIds) {

            this.pages = _.sortBy(this.pages, function(page) {
                return pageIds.indexOf(page.id);
            });

            return this;
        },

        deletePage: function(pageId) {

            this.pages = new PageWalker(this.pages).removePage(pageId);

            this.currentPageID = this.pages.length > 0 ? this.pages[0].id : undefined;

            return this;
        },

        duplicatePage: function(pageId) {

            // at time of writing, version of underscore is < 1.8, which supports
            // findIndex method:
            var index = 0;

            for (; index < this.pages.length; index++) {
                if (this.pages[index].id === pageId) {
                    break;
                }
            }

            // and insert after the current page:
            //this.pages.splice(index + 1, 0, this.pages[index].duplicate());

            // insert at end:
            this.pages.push(this.pages[index].duplicate());
            return this.pages[this.pages.length - 1].id;
        },

        updateControl: function(control) {
            var controlToUpdate = this.getPageByID(this.currentPageID).getControlByID(control.id);
            controlToUpdate = control;
            return this;
        },

        deleteControl: function(controlID) {
            // get current page's controls:
            var currentPage = this.getPageByID(this.currentPageID);
            var currentPageControls = currentPage.controls;
            currentPageControls = _.without(currentPageControls, _.findWhere(currentPageControls, {
                id: controlID
            }));

            currentPage.controls = currentPageControls;

            return this;
        },

        getPageNavigationTitles: function() {
            return _.pluck(this.pages, 'navigationTitle');
        },

        getPageByID: function(pageId) {
            return _.findWhere(this.pages, {
                id: pageId
            });
        },

        getPageByNavigationTitle: function(navigationTitle) {
            return _.find(this.pages, function(p) {
                return p.navigationTitle === navigationTitle;
            });
        },

        getFirstPage: function() {
            return typeof this.pages[0] === 'undefined' ? undefined : this.pages[0];
        },

        addControl: function(control) {
            var page = this.getPageByID(this.currentPageID);
            page.controls.push(control);
            return this;
        },

        setCurrentPageControls: function(controls) {
            var page = this.getPageByID(this.currentPageID);
            page.controls = controls;
            return this;
        },

        getPageTitles: function() {
            return _.pluck(this.pages, 'navigationTitle');
        },

        getSuggestedPageTitle: function() {
            var suggestedPageTitle,
                loop = 0,
                existingPageTitles = this.getPageTitles();

            for (loop = 0;; loop++) {

                // generate page title and determine whether it exists
                suggestedPageTitle = loop = 0 ? 'New Page' : ('New Page' + (loop + 1));

                if (existingPageTitles.indexOf(suggestedPageTitle) !== -1) {
                    break;
                }
            }

            return suggestedPageTitle;
        }

    });

    return Site;

});
