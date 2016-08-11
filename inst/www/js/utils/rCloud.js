define([], function() {

    'use strict';

    return {
        getLoggedInUser: function() {
            return window.rcloud.username();
        }
    };

});
