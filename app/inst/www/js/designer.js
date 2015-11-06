define([
    'rcap/js/serializer',
    'rcap/js/ui/menuManager',
    'rcap/js/ui/infoBarManager',
    'rcap/js/ui/dialogManager',
    'rcap/js/ui/messageManager',
    'rcap/js/ui/gridManager',
    'site/siteManager',
    'pubsub',
    'site/pubSubTable',
    'text!rcap/partials/designer.htm',
    'css!rcap/styles/default.css'
], function(Serializer, MenuManager, InfoBarManager, DialogManager, MessageManager, GridManager, SiteManager, PubSub, pubSubTable, mainPartial) {

    'use strict';

    var rcloudSelector = '.container, #rcloud-navbar-main, #rcloud-navbar-main, .navbar-fixed-top';
    var rcapSelector = '#rcap-designer';

    var bootstrap = function() {

        $('body').append(mainPartial);

        // close (link)
        $('#rcap-close').click(function() {

            $('body').removeClass('rcap-designer');

            $(rcloudSelector).show();

            // hide rcap:
            $(rcapSelector).hide();

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

        // info bar manager:
        new InfoBarManager().initialise();

        // initialise the dialog manager:
        new DialogManager().initialise();

        // initialise the message manager:
        new MessageManager().initialise();

        // grid manager:
        new GridManager().initialise();

        // serializer:
        new Serializer().initialise();

        $.getJSON('https://api.github.com/users/' + window.shell.notebook.model.user(), function(data) {
            var templateStr = '<a href="<%=data.html_url%>" target="_blank"><img src="<%=data.avatar_url%>" /></a>';
            var template = _.template(templateStr);
            $('#rcap-userplaceholder').append(template({
                data: data
            }));
        });

        // this should only run once, even if it's called more than once.
        bootstrap = function() {};
    };

    var Designer = function() {

        this.initialise = function() {

            bootstrap();

            $('body').addClass('rcap-designer');

            $('#rcap-preloader').show();

            // we want to be told when all has been done:
            PubSub.subscribe(pubSubTable.gridInitComplete, function() {

                $('#inner-stage').css({
                    'width': _.last(_.filter([800, 1024, 1280, 1366], function(width) {
                        return (screen.width - 100) > width;
                    })) + 'px',
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
