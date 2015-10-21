<% if(property.isHorizontal) { %>

	<div class="row">
        <div class="col-md-6">
            <label for="<%=property.id%>"><%=property.label%></label>
        </div>
        <div class="col-md-4">
            <div id="<%=property.id%>" />
		    <script type="text/javascript">
				$("#<%=property.id%>").slider({
					value: '<%=property.value%>',
					min: '<%=property.minValue%>',
					max: '<%=property.maxValue%>',
					step: 1,
					slide: function(event, ui) {
						$("#<%=property.id%>-value").text(ui.value);
					}
				});
		    </script>
        </div>
        <div class="col-md-2">
		    <div id="<%=property.id%>-value"><%=property.value%></div>
        </div>
    </div>

<% } else { %>

	<div class="form-group">
	    <label for="<%=property.id%>"><%=property.label%></label>
	    <div id="<%=property.id%>" />
	    <div id="<%=property.id%>-value"><%=property.value%></div>
	    <script type="text/javascript">
			$("#<%=property.id%>").slider({
				value: '<%=property.value%>',
				min: '<%=property.minValue%>',
				max: '<%=property.maxValue%>',
				step: 1,
				slide: function(event, ui) {
					$("#<%=property.id%>-value").text(ui.value);
				}
			});
	    </script>
	</div>

<% } %>