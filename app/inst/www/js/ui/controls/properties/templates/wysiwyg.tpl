<div class="form-group" id="form-group-<%=property.id%>">
    <label for="<%=property.id%>"><%=property.label%></label>
    <div>
    	<textarea class="form-control" rows="20" cols="50" id="<%=property.id%>" />
    </div>
    <div class="description"><%=property.helpText%></div>

    <script type="text/javascript">

        var index = 0;
        $('#<%=property.id%>').wysiwyg({
            classes: 'some-more-classes',
            toolbar: 'top-selection',
            buttons: {
                insertimage: {
                    title: 'Insert image',
                    image: '\uf030', 
                    showselection: index === 2 ? true : false
                },
                insertlink: {
                    title: 'Insert link',
                    image: '\uf08e'
                },
                fontname: index === 1 ? false : {
                    title: 'Font',
                    image: '\uf031',
                    popup: function( $popup/*, $button */ ) {
                            var listFontNames = {
                                    'Arial, Helvetica' : 'Arial,Helvetica',
                                    'Verdana'          : 'Verdana,Geneva',
                                    'Georgia'          : 'Georgia',
                                    'Courier New'      : 'Courier New,Courier',
                                    'Times New Roman'  : 'Times New Roman,Times'
                                };
                            var $list = $('<div/>').addClass('wysiwyg-plugin-list wysiwyg-fonts')
                                                   .attr('unselectable','on');
                            $.each( listFontNames, function( name, font ) {
                                var $link = $('<a/>').attr('href','#')
                                                    .css( 'font-family', font )
                                                    .html( name )
                                                    .click(function(event) {
                                                        $(element).wysiwyg('shell').fontName(font).closePopup();
                                                        // prevent link-href-#
                                                        event.stopPropagation();
                                                        event.preventDefault();
                                                        return false;
                                                    });
                                $list.append( $link );
                            });
                            $popup.append( $list );
                           },
                    showselection: index === 0 ? true : false    // wanted on selection
                },
                // Fontsize plugin
                fontsize: {
                    title: 'Size',
                    image: '\uf034', // <img src="path/to/image.png" width="16" height="16" alt="" />
                    popup: function( $popup/*, $button*/ ) {
                            // Hack: http://stackoverflow.com/questions/5868295/document-execcommand-fontsize-in-pixels/5870603#5870603
                            var listFontSizes = [], i;
                            for( i=8; i <= 11; ++i ){
                                listFontSizes.push(i+'px');
                            }
                            for( i=12; i <= 28; i+=2 ){
                                listFontSizes.push(i+'px');
                            }
                            listFontSizes.push('36px');
                            listFontSizes.push('48px');
                            listFontSizes.push('72px');
                            var $list = $('<div/>').addClass('wysiwyg-plugin-list')
                                                   .attr('unselectable','on');
                            $.each( listFontSizes, function( index, size ) {
                                var $link = $('<a/>').attr('href','#')
                                                    .html( size )
                                                    .click(function(event) {
                                                        $(element).wysiwyg('shell').fontSize(7).closePopup();
                                                        $(element).wysiwyg('container')
                                                                .find('font[size=7]')
                                                                .removeAttr('size')
                                                                .css('font-size', size);
                                                        // prevent link-href-#
                                                        event.stopPropagation();
                                                        event.preventDefault();
                                                        return false;
                                                    });
                                $list.append( $link );
                            });
                            $popup.append( $list );
                           }
                },
                // Header plugin
                header: {
                    title: 'Header',
                    image: '\uf0fd', 
                    popup: function( $popup/*, $button*/ ) {
                            var listHeaders = {
                                    // Name : Font
                                    'Header 1' : '<h1>',
                                    'Header 2' : '<h2>',
                                    'Header 3' : '<h3>',
                                    'Header 4' : '<h4>',
                                    'Header 5' : '<h5>',
                                    'Header 6' : '<h6>',
                                    'Code'     : '<pre>'
                                };
                            var $list = $('<div/>').addClass('wysiwyg-plugin-list')
                                                   .attr('unselectable','on');
                            $.each( listHeaders, function( name, format ) {
                                var $link = $('<a/>').attr('href','#')
                                                     .css( 'font-family', format )
                                                     .html( name )
                                                     .click(function(event) {
                                                        $(element).wysiwyg('shell').format(format).closePopup();
                                                        // prevent link-href-#
                                                        event.stopPropagation();
                                                        event.preventDefault();
                                                        return false;
                                                    });
                                $list.append( $link );
                            });
                            $popup.append( $list );
                           }
                },
                bold: {
                    title: 'Bold (Ctrl+B)',
                    image: '\uf032', 
                    hotkey: 'b'
                },
                italic: {
                    title: 'Italic (Ctrl+I)',
                    image: '\uf033', 
                    hotkey: 'i'
                },
                underline: {
                    title: 'Underline (Ctrl+U)',
                    image: '\uf0cd', 
                    hotkey: 'u'
                },
                strikethrough: {
                    title: 'Strikethrough (Ctrl+S)',
                    image: '\uf0cc', 
                    hotkey: 's'
                },
                forecolor: {
                    title: 'Text color',
                    image: '\uf111' 
                },
                highlight: {
                    title: 'Background color',
                    image: '\uf043' 
                },
                alignleft: index !== 0 ? false : {
                    title: 'Left',
                    image: '\uf036', 
                    showselection: false   
                },
                aligncenter: index !== 0 ? false : {
                    title: 'Center',
                    image: '\uf037', 
                    showselection: false    
                },
                alignright: index !== 0 ? false : {
                    title: 'Right',
                    image: '\uf038',
                    showselection: false   
                },
                alignjustify: index !== 0 ? false : {
                    title: 'Justify',
                    image: '\uf039', 
                    showselection: false
                },
                subscript: index === 1 ? false : {
                    title: 'Subscript',
                    image: '\uf12c',
                    showselection: true  
                },
                superscript: index === 1 ? false : {
                    title: 'Superscript',
                    image: '\uf12b',
                    showselection: true 
                },
                indent: index !== 0 ? false : {
                    title: 'Indent',
                    image: '\uf03c', 
                    showselection: false  
                },
                outdent: index !== 0 ? false : {
                    title: 'Outdent',
                    image: '\uf03b', 
                    showselection: false  
                },
                orderedList: index !== 0 ? false : {
                    title: 'Ordered list',
                    image: '\uf0cb', 
                    showselection: false  
                },
                unorderedList: index !== 0 ? false : {
                    title: 'Unordered list',
                    image: '\uf0ca', 
                    showselection: false 
                },
                removeformat: {
                    title: 'Remove format',
                    image: '\uf12d' 
                }
            },
            submit: {
                title: 'Submit',
                image: '\uf00c'
            },
            selectImage: 'Click or drop image',
            placeholderUrl: 'www.att.com',
            placeholderEmbed: '<embed/>',
            maxImageSize: [600,200],
        });


        $('#<%=property.id%>').wysiwyg('shell').setHTML('<%=property.value%>');

    </script>


    
</div>