define([], function() {

    'use strict';

    return {
        getLoggedInUser: function() {
            return window.rcloud.username();
        },
        getRcapViewUrl: function() {
            return window.ui_utils.make_url('shared.R/rcloud.rcap/rcap.html', { // jshint ignore:line
                notebook: window.shell.gistname()
            }); 
        }
    };

});
