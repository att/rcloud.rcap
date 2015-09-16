define(['text!rcap/partials/designer.htm', 
    'rcap/js/ui/menuManager',
    'rcap/js/ui/dialogManager', 
    'rcap/js/ui/gridManager',
    'site/siteManager',
    'pubsub',
    'site/pubSubTable',
    'rcap/js/serializer',
    'text!rcap/partials/_top-banner.htm',                       // DEMO
    //'font!google,families:[Open Sans:400]',
    'css!rcap/styles/default.css'
], function(mainPartial, MenuManager, dialogManager, GridManager, SiteManager, PubSub, pubSubTable, serializer, topBannerPartial) {

    'use strict';

    return {

        initialise: function() {

            //console.clear();

            var rcloudSelector = '.container, #rcloud-navbar-main, #rcloud-navbar-main, #rcloud-navbar-menu li:not(.rcap)';
            var rcapSelector = '#rcap-designer';


            if ($('body').find('#rcap-designer').length === 0) {

                // append if necessary:
                $('#rcloud-navbar-menu').append('<li class="rcap"><a href="#">Close</a></li>');

                $('body').append(mainPartial);

                /////////////////////////////////////////////////////////////////////
                //
                //
                //

                $('#top-banner').replaceWith(topBannerPartial);
                
                //
                //
                //
                /////////////////////////////////////////////////////////////////////

                // close:
                $('#rcloud-navbar-menu li.rcap').click(function() {
                    $(rcloudSelector).show();

                    // hide rcap:
                    $(rcapSelector).hide();

                    $(this).hide();

                    console.info('designer: PUBLISH : pubSubTable.close');

                    PubSub.publish(pubSubTable.close);
                });

                $('#rcap-save').click(function() {
                    PubSub.publish(pubSubTable.save);
                });





                // site manager:
                //////////////////////////////////////////////////////////////////////
                $('#page-header a').click(function() {
                    PubSub.publish(pubSubTable.addPage, {});
                });

                var siteManager = new SiteManager();
                siteManager.initialise();
                //////////////////////////////////////////////////////////////////////






                // menu manager:
                var menuManager = new MenuManager();
                menuManager.initialise();
                menuManager.initialiseControlsMenu();

                // initialise the dialog manager:
                dialogManager.initialise();

                // grid:
                var gridManager = new GridManager();
                gridManager.initialise();
                //gridManager.initialiseDesignGrids();

                // serializer:
                serializer.initialise();


            } 


            

            $(rcloudSelector).hide();

            // it may have been hidden from a previous 'close':
            $('#rcloud-navbar-menu li.rcap').show();
            $(rcapSelector).show();

            // load items:
            PubSub.publish(pubSubTable.deserialize, {
                type: 'designer'
            });
            



        }
    };
});
