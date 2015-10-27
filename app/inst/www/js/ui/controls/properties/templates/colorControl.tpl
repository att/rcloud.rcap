<%if(property.isHorizontal) { %>

    <div class="row">
        <div class="col-md-3">
            <label for="<%=property.id%>"><%=property.label%></label>
        </div>
        <div class="col-md-9">
            <input class="form-control" id="<%=property.id%>" value="<%=property.value%>" />
            <div class="description"><%=property.helpText%></div>
            <script type="text/javascript">
                $("#<%=property.id%>").spectrum({
                    showPalette: true,
                    showSelectionPalette: true, 
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
    		    palette: [],
                chooseText: 'Select',
                cancelText: 'Cancel',
                localStorageKey: 'rcap'
    		});
        </script>
    </div>

<% } %>