define(['pages/page', 'rcap/js/utils/pageWalker'], function(Page, PageWalker) {

    'use strict';

    var generateCopiedPageName = function(pages, pageName) {
        var existingPages = _.map(pages, function(p) {
                return p.navigationTitle.toUpperCase();
            }),
            test,
            index = 0,
            generatePageNameTest = function(page, index) {
                return index === 0 ? page : (page + ' (' + index.toString() + ')');
            };

        for (;; index++) {
            // naming convention is for 
            // 'Home Page' -> 'Home Page(n)', where n is positive integer and unique to existing page collection:

            // case insensitive:
            test = generatePageNameTest(pageName, index).toUpperCase();

            if (existingPages.indexOf(test) === -1) {
                break;
            }
        }

        // preserve case:
        return generatePageNameTest(pageName, index);
    };

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

            newPage.navigationTitle = generateCopiedPageName(this.pages, newPage.navigationTitle);

            if (options.parentPageId) {

                var parentPage = _.findWhere(this.pages, {
                    id: options.parentPageId
                });

                if (parentPage) {
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

            // update the enabled status of this and all its (if any) child pages:
            var pages = new PageWalker(this.pages).getDescendantsAndSelf(pageObj.id);

            _.each(pages, function(p) {
                p.isEnabled = pageObj.isEnabled;
            });           

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

        duplicatePage: function(rootPageId) {

            // get the page(s) that need to be duplicated;
            // if the page has child pages, they will also need to be duplicated:
            var me = this,
                pagesToCopy = new PageWalker(this.pages).getDescendantsAndSelf(rootPageId),
                newPage,
                mappings = [],
                newPages = [];

            // generate, rename and push:
            _.each(pagesToCopy, function(pageToCopy) { 
                // if this is the root page, retain its parent ID,
                // otherwise reassign:
                newPage = pageToCopy.duplicate();

                // update the mappings:
                mappings.push({
                    oldId : pageToCopy.id,
                    newId : newPage.id
                });

                // update the page name:
                newPage.navigationTitle = generateCopiedPageName(me.pages, newPage.navigationTitle);
                
                // does this new page's parent ID need to be updated? (based on the mappings that have
                // been collated):
                if(pageToCopy.id !== rootPageId) { // root page should stay the same since it will have the same parent!
                    var foundMapping = _.findWhere(mappings, { oldId : newPage.parentId });

                    if(foundMapping) {
                        newPage.parentId = foundMapping.newId;  
                    }
                }

                // add the new page to the new pages:
                newPages.push(newPage);

                // and add to the site:
                me.pages.push(newPage);

            });

            return newPages;
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