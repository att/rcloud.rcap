<% if(property.isHorizontal) { %>

	<div class="row">
        <div class="col-md-3">
            <label for="<%=property.id%>"><%=property.label%></label>
        </div>
        <div class="col-md-9">
            <input id="<%=property.id%>" value="" />
        </div>
    </div>

<% } else { %>

	<div class="form-group">
	    <label for="<%=property.id%>"><%=property.label%></label>
	    <input id="<%=property.id%>" value="" />
	</div>

<% } %>


<script type="text/javascript">
	$("#<%=property.id%>").ionRangeSlider({
		keyboard: true,
		grid: true,
		hide_min_max: true,
		from: <%=property.value === '' ? 0 : property.value %>,
		min: <%=property.minValue%>,
		max: <%=property.maxValue%>,
		step: 1
    });
</script>