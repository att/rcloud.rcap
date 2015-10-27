<div class="form-group" id="form-group-<%=property.id%>">
	<label for="<%=property.id%>"><%=property.label%></label>
	<input class="form-control" id="<%=property.id%>" value="<%=property.value%>" />
	<div class="description"><%=property.helpText%></div>
</div>


<script type="text/javascript">

	$('#<%=property.id%>').autocomplete({
            source: function(request, response) {
                  response(window.RCAP['<%=property.serviceName%>']());
            }
      });

</script>