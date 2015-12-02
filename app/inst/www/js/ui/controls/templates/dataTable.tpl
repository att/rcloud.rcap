<table class="dataTable" id="<%=control.id%>" data-variablename="<%=control.controlProperties[0].value%>" data-controltype="datatable"></table>

<%if(designTimeDescription.length && isDesignTime) {%>
	<pre><%=designTimeDescription%></pre>
<%}%>	

<% if(isDesignTime) { %>
<script type="text/javascript">

	$('#<%=control.id%>').dataTable({
		"data":[{"Column1":"5.1","Column2":"3.5","Column3":"1.4","Column4":"0.2","Column5":"setosa"},{"Column1":"4.9","Column2":"3","Column3":"1.4","Column4":"0.2","Column5":"setosa"},{"Column1":"4.7","Column2":"3.2","Column3":"1.3","Column4":"0.2","Column5":"setosa"},{"Column1":"4.6","Column2":"3.1","Column3":"1.5","Column4":"0.2","Column5":"setosa"},{"Column1":"5","Column2":"3.6","Column3":"1.4","Column4":"0.2","Column5":"setosa"},{"Column1":"5.4","Column2":"3.9","Column3":"1.7","Column4":"0.4","Column5":"setosa"},{"Column1":"4.6","Column2":"3.4","Column3":"1.4","Column4":"0.3","Column5":"setosa"},{"Column1":"5","Column2":"3.4","Column3":"1.5","Column4":"0.2","Column5":"setosa"},{"Column1":"4.4","Column2":"2.9","Column3":"1.4","Column4":"0.2","Column5":"setosa"},{"Column1":"4.9","Column2":"3.1","Column3":"1.5","Column4":"0.1","Column5":"setosa"},{"Column1":"5.4","Column2":"3.7","Column3":"1.5","Column4":"0.2","Column5":"setosa"},{"Column1":"4.8","Column2":"3.4","Column3":"1.6","Column4":"0.2","Column5":"setosa"},{"Column1":"4.8","Column2":"3","Column3":"1.4","Column4":"0.1","Column5":"setosa"},{"Column1":"4.3","Column2":"3","Column3":"1.1","Column4":"0.1","Column5":"setosa"},{"Column1":"5.8","Column2":"4","Column3":"1.2","Column4":"0.2","Column5":"setosa"},{"Column1":"5.7","Column2":"4.4","Column3":"1.5","Column4":"0.4","Column5":"setosa"},{"Column1":"5.4","Column2":"3.9","Column3":"1.3","Column4":"0.4","Column5":"setosa"},{"Column1":"5.1","Column2":"3.5","Column3":"1.4","Column4":"0.3","Column5":"setosa"},{"Column1":"5.7","Column2":"3.8","Column3":"1.7","Column4":"0.3","Column5":"setosa"},{"Column1":"5.1","Column2":"3.8","Column3":"1.5","Column4":"0.3","Column5":"setosa"}],
		"columns":[{"data":"Column1","title":"Column1"},{"data":"Column2","title":"Column2"},{"data":"Column3","title":"Column3"},{"data":"Column4","title":"Column4"},{"data":"Column5","title":"Column5"}]
	});

</script>
<% } %>