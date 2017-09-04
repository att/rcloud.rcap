define(['controls/factories/controlFactory',
'rcap/js/Class'], function(ControlFactory) {

    'use strict';
    
    var controlFactory = new ControlFactory();

    var generateId = function() {
        return 'rcap' + Math.random().toString(16).slice(2);
    };

    var Page = Class.extend({
        init: function(options) {
            options = options || {};

            this.navigationTitle = options.navigationTitle || 'New Page';
            this.isEnabled = true;
            this.depth = 1;
            this.parentId = options.parentId;
            this.id = options.id || generateId();

            this.controls = options.controls || [];
        },
        deserialize: function() {

        },
        serialize: function() {

        },
        render: function() {

        },
        getDialogMarkup: function() {

        },
        getDialogValue: function() {

        },
        toJSON: function() {
            return {
                'depth': this.depth,
                'id': this.id,
                'parentId' : this.parentId,
                'navigationTitle': this.navigationTitle,
                'isEnabled': this.isEnabled,
                'controls': this.controls,
                'pages': this.pages
            };
        },
        getControlByID: function(controlID) {
            return _.findWhere(this.controls, {
                id: controlID
            });
        },
        duplicate: function() {
            var dupe = $.extend(true, {}, this);
            dupe.id = generateId();
            dupe.controls = [];     

            _.each(this.controls, function(c) {
                /*
                var currentControl = $.extend(true, {}, c);
                currentControl.id = generateId();
                dupe.controls.push(currentControl);
                */

                /*
                var control = controlFactory.getByKey(c.type);
                control.isOnGrid = true;
                dupe.controls.push(control);
                console.info('pushing control: ', control);
                */

                dupe.controls.push(controlFactory.duplicateControl(c));
            });

            return dupe;
        },
        canAddChild: function() {
            return this.depth <= 2;
        }
    });

    return Page;

});
