define(['rcap/js/ui/controls/gridControl',
    'text!controlTemplates/profileConfigurator.tpl'

], function(GridControl, tpl) {

    'use strict';

    var ProfileConfiguratorControl = GridControl.extend({
        init: function() {
            this._super({
                type: 'profileconfigurator',
                controlCategory: 'Dynamic',
                label: 'Profile',
                icon: 'user',
                controlProperties: [

                ]
            });
        },
        render: function() {

            var template = _.template(tpl);

            return template({
                control: this
            });

        }
    });

    return ProfileConfiguratorControl;

});
