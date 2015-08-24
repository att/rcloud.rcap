define(['text!rcap/partials/designer.htm', 
    'rcap/js/ui/menuManager',
    'rcap/js/ui/dialogManager', 
    'rcap/js/ui/gridManager',
    'pubsub',
    'rcap/js/serializer',
    //'font!google,families:[Open Sans:400]',
    'css!rcap/styles/default.css'
], function(mainPartial, MenuManager, dialogManager, GridManager, PubSub, serializer) {

    'use strict';

    return {

        initialise: function() {

            console.clear();

            var rcloudSelector = '.container, #rcloud-navbar-main, #rcloud-navbar-main, #rcloud-navbar-menu li:not(.rcap)';
            var rcapSelector = '#rcap-designer';

            if ($('body').find('#rcap-designer').length === 0) {

                // append if necessary:
                $('#rcloud-navbar-menu').append('<li class="rcap"><a href="#">Close</a></li>');

                $('body').append(mainPartial);

                // close:
                $('#rcloud-navbar-menu li.rcap').click(function() {
                    $(rcloudSelector).show();

                    // hide rcap:
                    $(rcapSelector).hide();

                    $(this).hide();

                    PubSub.publish('rcap:close', {});
                });

                $('#rcap-save').click(function() {
                    PubSub.publish('rcap:save', {});
                });

                // menu manager:
                var menuManager = new MenuManager();
                menuManager.initialiseControlsMenu();

                // initialise the dialog manager:
                dialogManager.initialise();

                // grid:
                var gridManager = new GridManager();
                gridManager.initialiseDesignGrid();

                // serializer:
                serializer.initialise();
            } 

            $(rcloudSelector).hide();

            // it may have been hidden from a previous 'close':
            $('#rcloud-navbar-menu li.rcap').show();
            $(rcapSelector).show();

            // load items:
            PubSub.publish('rcap:deserialize', {});
            
        }
    };
});
