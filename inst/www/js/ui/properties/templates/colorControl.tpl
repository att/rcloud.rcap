<%if(property.isHorizontal) { %>

    <div class="row">
        <div class="col-md-4">
            <label for="<%=property.id%>"><%=property.label%></label>
        </div>
        <div class="col-md-8">
            <input class="form-control" id="<%=property.id%>" />
            <div class="description"><%=property.helpText%></div>
            <script type="text/javascript">
                $("#<%=property.id%>").spectrum({
                    showPalette: true,
                    showSelectionPalette: true,
                    showAlpha: <%=property.showAlpha%>,
                    palette: [],
                    chooseText: 'Select',
                    cancelText: 'Cancel',
                    localStorageKey: 'rcap',
                    color: '<%=property.getValueOrDefault()%>',
                    showInput: true,
                    allowEmpty: true,
                    appendTo: '#dialog-controlSettings',
                    preferredFormat: 'name'
                });
            </script>
        </div>
    </div>

<% } else { %>

    <div class="form-group" id="form-group-<%=property.id%>">
        <label for="<%=property.id%>"><%=property.label%></label>
        <div>
        	<input class="form-control" id="<%=property.id%>" />
        </div>
        <div class="description"><%=property.helpText%></div>
        <script type="text/javascript">
    		$("#<%=property.id%>").spectrum({
    		    showPalette: true,
    		    showSelectionPalette: true,
                showAlpha: <%=property.showAlpha%>,
    		    palette: [],
                chooseText: 'Select',
                cancelText: 'Cancel',
                localStorageKey: 'rcap',
                color: '<%=property.getValueOrDefault()%>',
                showInput: true,
                allowEmpty: true,
                appendTo: '#dialog-controlSettings',
                preferredFormat: 'name'
    		});
        </script>
    </div>

<% } %>
