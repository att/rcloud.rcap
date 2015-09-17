define([
    'rcap/js/serializer',
    'rcap/js/ui/menuManager',
    'rcap/js/ui/dialogManager',
    'rcap/js/ui/gridManager',
    'site/siteManager',
    'pubsub',
    'site/pubSubTable',
    'text!rcap/partials/designer.htm',
    'css!rcap/styles/default.css'
], function(Serializer, MenuManager, DialogManager, GridManager, SiteManager, PubSub, pubSubTable, mainPartial) {

    'use strict';

    var rcloudSelector = '.container, #rcloud-navbar-main, #rcloud-navbar-main, #rcloud-navbar-menu li:not(.rcap)';
    var rcapSelector = '#rcap-designer';

    var bootstrap = function() {

        $('#rcloud-navbar-menu').append('<li class="rcap"><a href="#">Close</a></li>');

        $('body').append(mainPartial);

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
        new SiteManager().initialise();

        // menu manager:
        new MenuManager().initialise().initialiseControlsMenu();

        // initialise the dialog manager:
        new DialogManager().initialise();

        // grid manager:
        new GridManager().initialise();

        // serializer:
        new Serializer().initialise();

        bootstrap = function() {};
    };

    var Designer = function() {

        this.initialise = function() {

            bootstrap();

            $(rcloudSelector).hide();

            // it may have been hidden from a previous 'close':
            $('#rcloud-navbar-menu li.rcap').show();
            $(rcapSelector).show();

            // load items:
            PubSub.publish(pubSubTable.deserialize, {
                type: 'designer'
            });
        };

    };

    return Designer;
});