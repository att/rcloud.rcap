define([
    'rcap/js/utils/rCloud',
    'rcap/js/serializer',
    'rcap/js/ui/menuManager',
    'rcap/js/ui/infoBarManager',
    'rcap/js/ui/dialogManager',
    'rcap/js/ui/messageManager',
    'rcap/js/ui/dirtyStateIndicator',
    'rcap/js/ui/gridManager',
    'rcap/js/ui/themeManager',
    'rcap/js/assetManager',
    'site/siteManager',
    'pubsub',
    'site/pubSubTable',
    'text!rcap/partials/designer.htm',
    'css!rcap/styles/default.css'
], function(rcloud, Serializer, MenuManager, InfoBarManager, DialogManager, MessageManager, DirtyStateIndicator, GridManager, ThemeManager, AssetManager, SiteManager, PubSub, pubSubTable, mainPartial) {

    'use strict';

    var rcloudSelector = '.container, #rcloud-navbar-main, #rcloud-navbar-main, .navbar-fixed-top';
    var rcapSelector = '#rcap-designer';
    var themeManager = new ThemeManager();

    var closeDesigner = function() {
        $('body').removeClass('rcap-designer');

        themeManager.cleanUp();

        $(rcloudSelector).show();

        // hide rcap:
        $(rcapSelector).hide();

        console.info('designer: PUBLISH : pubSubTable.close');
        PubSub.publish(pubSubTable.close);
    };

    var bootstrap = function() {

        $('body').append(mainPartial);

        // close (link)
        $('#rcap-close').click(function() {
            PubSub.publish(pubSubTable.closeDesigner);
        });

        PubSub.subscribe(pubSubTable.closeDesignerConfirm, function() {
            closeDesigner();
        });

        $('#rcap-save').click(function() {
            PubSub.publish(pubSubTable.save);
        });

        $('#rcap-view').click(function() {
            window.open(rcloud.getRcapViewUrl());
        });
            
        // theme manager:
        themeManager.initialise();

        // site manager: 
        new SiteManager().initialise();

        // menu manager:
        new MenuManager().initialise()
            .initialiseControlsMenu()
            .initialiseSettingsMenu();

        // info bar manager:
        new InfoBarManager().initialise();

        // initialise the dialog manager:
        new DialogManager().initialise();

        // initialise the message manager:
        new MessageManager().initialise();

        // initialise the dirty state indicator:
        new DirtyStateIndicator().initialise();

        // grid manager:
        new GridManager().initialise();

        // serializer:
        new Serializer().initialise();

        // asset manager:
        new AssetManager().initialise();

        /*
        $.getJSON('https://api.github.com/users/' + rcloud.getLoggedInUser(), function(data) {
            var templateStr = '<a href="<%=data.html_url%>" target="_blank"><img src="<%=data.avatar_url%>" /></a>';
            var template = _.template(templateStr);
            $('#rcap-userplaceholder').append(template({
                data: data
            }));
        });
        */

        $('#rcap-version').html(window.RCAP.getRCAPVersion());

        // this should only run once, even if it's called more than once.
        bootstrap = function() {};
    };

    var Designer = function() {

        this.initialise = function(sessionInfo) { // jshint ignore:line

            bootstrap();

            $('body').addClass('rcap-designer');
            $('body').data({
                'nodenameusername': sessionInfo.nodeNameUserName,
                'nodename': sessionInfo.nodeName,
                'user': sessionInfo.user
            });

            // theme manager:
            themeManager.initialise();

            $('#rcap-preloader').show();

            // we want to be told when all has been done:
            PubSub.subscribe(pubSubTable.gridInitComplete, function() {

                $('#inner-stage').css({
                    'width': (screen.width - 140).toString() + 'px',
                    'margin-top': '40px',
                    'margin-bottom': '40px',
                    'margin-left': 'auto',
                    'margin-right': 'auto'
                });

                setTimeout(function() {

                    $(rcloudSelector).hide();

                    // it may have been hidden from a previous 'close':
                    $('#rcloud-navbar-menu li.rcap').show();

                    $(rcapSelector).show();

                    // ensure that the top of the design surface is shown:
                    location.hash = 'rcap-stage';

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
