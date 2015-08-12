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
		    palette: []
		});
    </script>
</div>