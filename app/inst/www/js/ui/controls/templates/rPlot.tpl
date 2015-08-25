<div id="<%=control.id%>" class="r"></div>
<script type="text/javascript">
if (typeof notebook_result.<%=control.id%> === 'function') { 

	// determine the width and height of the object:
	var $enclosingDiv = $('#<%=control.id%>').closest('.grid-stack-item-content');

    notebook_result.<%=control.id%>($enclosingDiv.width(), $enclosingDiv.height(), function() {});
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