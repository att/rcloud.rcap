define([
    'rcap/js/serializer',
    'rcap/js/ui/menuManager',
    'rcap/js/ui/dialogManager',
    'rcap/js/ui/messageManager',
    'rcap/js/ui/gridManager',
    'site/siteManager',
    'pubsub',
    'site/pubSubTable',
    'text!rcap/partials/designer.htm',
    'css!rcap/styles/default.css'
], function(Serializer, MenuManager, DialogManager, MessageManager, GridManager, SiteManager, PubSub, pubSubTable, mainPartial) {

    'use strict';

    var rcloudSelector = '.container, #rcloud-navbar-main, #rcloud-navbar-main, #rcloud-navbar-menu li:not(.rcap)';
    var rcapSelector = '#rcap-designer';

    var bootstrap = function() {

        $('#rcloud-navbar-menu').append('<li style="display:none" class="rcap"><button class="btn btn-primary" id="rcap-save">Save</button></li><li style="display:none" class="rcap"><a href="#">Close</a></li>');

        $('body').append(mainPartial);

        // close (link)
        $('#rcloud-navbar-menu li.rcap a').click(function() {

            $(rcloudSelector).show();

            // hide rcap:
            $(rcapSelector).hide();

            $('#rcloud-navbar-menu li.rcap').hide();

            console.info('designer: PUBLISH : pubSubTable.close');
            PubSub.publish(pubSubTable.close);
        });

        $('#rcap-save').click(function() {
            PubSub.publish(pubSubTable.save);
        });

        // site manager: 
        new SiteManager().initialise();

        // menu manager:
        new MenuManager().initialise().initialiseControlsMenu();

        // initialise the dialog manager:
        new DialogManager().initialise();

        // initialise the message manager:
        new MessageManager().initialise();

        // grid manager:
        new GridManager().initialise();

        // serializer:
        new Serializer().initialise();

        // this should only run once, even if it's called more than once.
        bootstrap = function() {};
    };

    var Designer = function() {

        this.initialise = function() {

            bootstrap();

            $('#rcap-preloader').show();

            // we want to be told when all has been done:
            PubSub.subscribe(pubSubTable.gridInitComplete, function() {

                setTimeout(function() {

                    $(rcloudSelector).hide();

                    // it may have been hidden from a previous 'close':
                    $('#rcloud-navbar-menu li.rcap').show();

                    $(rcapSelector).show();

                    // ensure that the top of the design surface is shown:
                    location.hash = 'inner-stage';

                    $('#rcap-preloader').fadeOut();
                
                }, 0);

            });

            // load items:
            PubSub.publish(pubSubTable.deserialize, {
                isDesignTime: true
            });
        };

    };

    return Designer;
});