<div id="<%=control.id%>" class="r"></div>
<script type="text/javascript">
if (typeof notebook_result.<%=control.id%> === 'function') { 
    notebook.result<%=control.id%>(function() {});
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