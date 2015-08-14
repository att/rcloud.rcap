<div class="form-group" id="form-group-<%=property.id%>">
    <label for="<%=property.id%>"><%=property.label%></label>
    <div>
    	<textarea class="form-control" rows="20" cols="50" id="<%=property.id%>" value="<%=property.value%>" />
    </div>
    <div class="description"><%=property.helpText%></div>
    <script type="text/javascript">
		$("#<%=property.id%>").wysiwyg();
    </script>
</div>