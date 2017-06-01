define(['rcap/js/ui/controls/gridControl',
    'text!controlTemplates/profileConfigurator.tpl',
    'pubsub',
    'site/pubSubTable',
], function(GridControl, tpl, PubSub, pubSubTable) {

    'use strict';

    var ProfileConfiguratorControl = GridControl.extend({
        init: function() {
            this._super({
                type: 'profileconfigurator',
                controlCategory: 'Dynamic',
                label: 'Profile',
                icon: 'user',
                controlProperties: []
            });
        },
        render: function() {

            var template = _.template(tpl);

            return template({
                control: this
            });

        },
        initialiseViewerItems: function() {
          $('.grid-stack-item-content.rcap-controltype-profileconfigurator').click(function() {
            PubSub.publish(pubSubTable.showViewerProfileDialog);
          });
        }
    });

    return ProfileConfiguratorControl;

});
