define(['pages/page'], function(Page) {

    'use strict';

    var Site = Class.extend({
        
        init: function(options) {
            options = options || {};
            
            this.saveTicks = options.saveTicks;
            this.isDesignTime = options.isDesignTime; 

            // initialise with a single page:
            this.pages = options.pages || [
                new Page({
                    navigationTitle : 'Home Page'
                }), 
            ];

            this.currentPageID = this.pages.length > 0 ? this.pages[0].id : undefined;
        },

        save: function() {
        	this.saveTicks = new Date().getTime();
        },

        toJSON: function() {

            return {
                'saveTicks' : this.saveTicks,
                'pages' : this.pages
            };

        },

        createPage : function() {
            return new Page();
        },

        addPage : function(page) {
            this.pages.push(page);
            return this;
        },

        updatePage : function(pageObj) {
            var page = this.getPageByID(pageObj.id);
            page.navigationTitle = pageObj.navigationTitle;
            //page.pageTitle = pageObj.title;
            //page.urlSlug = pageObj.urlSlug;

            return this;
        },

        updatePageOrder : function(pageIds) {

            // create a new array:

            // var me = this,
            //     newPageItems = [];

            // _.each(pageIds, function(pageId) {
            //     newPageItems.push(me.getPageByID(pageId));
            // });

            // this.setCurrentPageControls(newPageItems);

            this.pages = _.sortBy(this.pages, function(page) {
                return pageIds.indexOf(page.id);
            });

            return this;
        },

        deletePage : function(pageId) {

            this.pages = _.without(this.pages, _.findWhere(this.pages, { id : pageId }));
            return this;
        },

        updateControl : function(control) {
            var controlToUpdate = this.getPageByID(this.currentPageID).getControlByID(control.id);
            controlToUpdate = control;
            return this;
        },

        deleteControl : function(controlID) {
            // get current page's controls:
            var currentPage = this.getPageByID(this.currentPageID);
            var currentPageControls = currentPage.controls;
            currentPageControls = _.without(currentPageControls, _.findWhere(currentPageControls, { id : controlID }));

            currentPage.controls = currentPageControls;

            return this;
        },

        getPageByID : function(pageId) {
            return _.findWhere(this.pages, { id : pageId });
        },

        getPageByNavigationTitle : function(navigationTitle) {
            return _.find(this.pages, function(p) { return p.navigationTitle === navigationTitle; });
        },

        addControl : function(control) {
            var page = this.getPageByID(this.currentPageID);
            page.controls.push(control);
            return this;
        },

        setCurrentPageControls : function(controls) {
            var page = this.getPageByID(this.currentPageID);
            page.controls = controls;
            return this;
        },

        getPageTitles : function() {
            return _.pluck(this.pages, 'navigationTitle');
        },

        getSuggestedPageTitle : function() {
            var suggestedPageTitle, 
                loop = 0,
                existingPageTitles = this.getPageTitles();

            for(loop = 0; ; loop++) {

                // generate page title and determine whether it exists
                suggestedPageTitle = loop = 0 ? 'New Page' : ('New Page' + (loop + 1));

                if( existingPageTitles.indexOf(suggestedPageTitle) !== -1) {
                    break;
                }
            }

            return suggestedPageTitle;
        }

    });

    return Site;

});
