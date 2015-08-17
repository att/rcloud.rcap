define(['text!rcap/partials/main.htm', 
    'rcap/js/ui/menu-manager',
    'rcap/js/ui/dialog-manager', 
    'rcap/js/ui/grid-manager',
    //'controls/image',
    'pubsub',
    'rcap/js/serializer'
], function(mainPartial, MenuManager, dialogManager, gridManager, /*Image,*/ PubSub, serializer) {

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
                gridManager.initialise();

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
