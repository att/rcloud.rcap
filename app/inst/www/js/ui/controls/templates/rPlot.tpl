<div id="<%=control.id%>" class="r"></div>
<script type="text/javascript">
if (typeof <%=control.id%> === 'function') { 
    <%=control.id%>();
} else {
	$('#<%=control.id%>')
		.css({
			'color' : 'red',
			'font-weight' : 'bold',
			'border' : '1px solid red'
		})
		.text('the function <%=control.id%>() does not exist...');
}
</script>