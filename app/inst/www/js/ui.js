define(['text!rcap/partials/main.htm', 
    'rcap/js/ui/menu-manager',
    'rcap/js/ui/dialog-manager', 
    'rcap/js/ui/grid-manager',
    'controls/image'
], function(mainPartial, MenuManager, dialogManager, gridManager, Image) {

    'use strict';

    return {
        initialise: function() {

            console.clear();

            if ($('body').find('#rcap-designer').length === 0) {

                // append if necessary:
                $('#rcloud-navbar-menu').append('<li class="rcap"><a href="#">Close</a></li>');

                $('body').append(mainPartial);

                $('#rcloud-navbar-menu li.rcap').click(function() {
                    $('.container, #rcloud-navbar-main, #rcloud-navbar-main, #rcloud-navbar-menu li:not(.rcap)').show();
                    $(this).hide();
                });

                $('#rcap-save').click(function() {

                    var items = [], currentControl;

                    $('.grid-stack-item[data-controlid]').each(function() {

                        currentControl = $(this).data('control');
                        console.log('current control: ', currentControl);

                        items.push(currentControl);
                    });

                    var json = JSON.stringify(items);

                    console.log('serialized: ', json);

                    // deserialize:
                    var objects = JSON.parse(json);

                    console.log('objects: ', objects);

                    // create new dynamic object:
                    var image = new Image(objects[0]);


                    console.log(image);

                });

                // menu manager:
                var menuManager = new MenuManager();
                menuManager.initialiseControlsMenu();

                // initialise the dialog manager:
                dialogManager.initialise();

                // grid:
                gridManager.initialise();
            }

            $('.container, #rcloud-navbar-main, #rcloud-navbar-main, #rcloud-navbar-menu li:not(.rcap)').hide();

            // it may have been hidden from a previous 'close':
            $('#rcloud-navbar-menu li.rcap').show();
        }
    };
});
