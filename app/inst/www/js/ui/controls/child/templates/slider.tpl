<% 
if(typeof control.controlProperties[0].value !== 'undefined' && control.controlProperties[0].value.length > 0)  { 
%>
<label for="<%=controlId%>">
    <%=control.controlProperties[0].value%>
</label>
<% } %>

<input type="text" id="<%=controlId%>" name="<%=control.getControlPropertyValueOrDefault('variablename')%>" data-variablename="<%=control.getControlPropertyValueOrDefault('variablename')%>" value=""></div>

<script type="text/javascript">

$(function() {

	$('#<%=controlId%>').ionRangeSlider({
		keyboard: true,
		grid: true,
		hide_min_max: true,
		from: <%=control.getControlPropertyValueOrDefault('value')%>,
		min: <%=control.getControlPropertyValueOrDefault('min')%>,
		max: <%=control.getControlPropertyValueOrDefault('max')%>,
		step: <%=control.getControlPropertyValueOrDefault('step')%>,

    });
	
});

</script>