define([], function() {

    'use strict';

    return {
        getUrlSearchValue : function(query) {
	    if(_.isUndefined(window.URLSearchParams)) {
	       return undefined;
	    }
            var searchParams = new window.URLSearchParams(window.location.search);
            return searchParams.get(query);
        },
        getGridPreferences : function() {
            var width = this.getUrlSearchValue('width'),
                height = this.getUrlSearchValue('height'),
                align = this.getUrlSearchValue('align'),
                prefs = {};

            if(width && !isNaN(width)) {
                prefs.width = +width;
            }
            
            if(height && !isNaN(height)) {
                prefs.height = +height;
            }

            if(align && ['left', 'center'].indexOf(align) !== -1) {
                prefs.align = align;
            }

            return Object.keys(prefs).length ? prefs : null;
        }  
    }; 
}); 