<%if(property.isHorizontal) { %>

    <div class="row">
        <div class="col-md-4">
            <label for="<%=property.id%>"><%=property.label%></label>
        </div>
        <div class="col-md-8">
            <input class="form-control" id="<%=property.id%>" value="<%=property.value%>" />
            <div class="description"><%=property.helpText%></div>
            <script type="text/javascript">
                $("#<%=property.id%>").spectrum({
                    showPalette: true,
                    showSelectionPalette: true, 
                    showAlpha: true,
                    palette: [],
                    chooseText: 'Select',
                    cancelText: 'Cancel',
                    localStorageKey: 'rcap'
                });
            </script>
        </div>
    </div>

<% } else { %>

    <div class="form-group" id="form-group-<%=property.id%>">
        <label for="<%=property.id%>"><%=property.label%></label>
        <div>
        	<input class="form-control" id="<%=property.id%>" value="<%=property.value%>" />
        </div>
        <div class="description"><%=property.helpText%></div>
        <script type="text/javascript">
    		$("#<%=property.id%>").spectrum({
    		    showPalette: true,
    		    showSelectionPalette: true, 
                showAlpha: true,
    		    palette: [],
                chooseText: 'Select',
                cancelText: 'Cancel',
                localStorageKey: 'rcap'
    		});
        </script>
    </div>

<% } %>