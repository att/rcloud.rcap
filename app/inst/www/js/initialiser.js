define([], function() {

    'use strict';

    return {

        bootstrap: function() {

            RCloud.UI.cell_commands.add({   // jshint ignore:line
                rcapDesigner: {
                    area: 'cell',
                    sort: 1099, // right after language chooser
                    //create: function(cell_model, cell_view) {
                    create: function() {
                        // choosing a random icon from http://fontawesome.io/3.2.1/icons/
                        // if none of them work, we can add an option to use bitmap
                        // or other custom button control
                        return RCloud.UI.cell_commands.create_button('icon-sitemap', 'rcap designer', function() { // jshint ignore:line
                            alert('I am going to launch the RCAP designer...');
                        });
                    }
                }
            });

            RCloud.UI.share_button.add({ // jshint ignore:line
                'Design': {
                    sort: 1001,
                    page: 'shared.R/rcloud.rcap/default.html'
                }
            });

            // for rcap link, don't move away, simply initialise:
            $('body').on('click', '#share-link[href*="shared.R/rcloud.rcap/default.html"]', function(e) {
                //ui.initialise();

                require(['rcap/js/ui'], function(ui){
                    ui.initialise();
                });

                e.preventDefault();
                return false;
            });

            Notebook.Cell.postprocessors.add({
                rcappp: {
                    sort: 2000,
                    process: function(div) {

                        console.log('rcappp', div);

                        // var iip_cell = div.find('.iipsettings');
                        // if (iip_cell.size()) {
                        //     // Only get here if it's a settings cell
                        //     try {
                        //         var opts = YAML.parse(iip_cell.text());
                        //         if ($.isPlainObject(opts)) {
                        //             iip.applyGlobalSettings(opts);

                        //         } else {
                        //             throw 'YAML parse failed';
                        //         }
                        //     } catch (er) {
                        //         console.log('Options errors:' + er);
                        //     }
                        // }
                    }
                }
            });


        }

    };

});
