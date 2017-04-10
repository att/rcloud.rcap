<% 
if(typeof control.controlProperties[0].value !== 'undefined' && control.controlProperties[0].value.length > 0)  { 
%>
<label for="<%=controlId%>">
    <%=control.controlProperties[0].value%>
</label>
<% } %>

<input type="text" id="<%=controlId%>" name="<%=control.getPropertyValueOrDefault('variablename')%>" data-variablename="<%=control.getPropertyValueOrDefault('variablename')%>" value=""></input>

<script type="text/javascript">

$(function() {

	$('#<%=controlId%>').ionRangeSlider({
		keyboard: true,
		grid: true,
		force_edges: true,
		from: <%=control.getPropertyValueOrDefault('value')%>,
		min: <%=control.getPropertyValueOrDefault('min')%>,
		max: <%=control.getPropertyValueOrDefault('max')%>,
		step: <%=control.getPropertyValueOrDefault('step')%>
    });
	
});

</script>