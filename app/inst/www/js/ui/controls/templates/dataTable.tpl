<table class="dataTable" id="<%=control.id%>" data-variablename="<%=control.controlProperties[0].value%>" data-controltype="datatable">
</table>

<%if(designTimeDescription.length && isDesignTime) {%>
	<pre><%=designTimeDescription%></pre>
<%}%>	

<% if(isDesignTime) { %>
<script type="text/javascript">

    var opts = {
        data:[["5.1","3.5","1.4","0.2","setosa"],["4.9","3","1.4","0.2","setosa"],["4.7","3.2","1.3","0.2","setosa"],["4.6","3.1","1.5","0.2","setosa"],["5","3.6","1.4","0.2","setosa"],["5.4","3.9","1.7","0.4","setosa"],["4.6","3.4","1.4","0.3","setosa"],["5","3.4","1.5","0.2","setosa"],["4.4","2.9","1.4","0.2","setosa"],["4.9","3.1","1.5","0.1","setosa"],["5.4","3.7","1.5","0.2","setosa"],["4.8","3.4","1.6","0.2","setosa"],["4.8","3","1.4","0.1","setosa"],["4.3","3","1.1","0.1","setosa"],["5.8","4","1.2","0.2","setosa"],["5.7","4.4","1.5","0.4","setosa"],["5.4","3.9","1.3","0.4","setosa"],["5.1","3.5","1.4","0.3","setosa"],["5.7","3.8","1.7","0.3","setosa"],["5.1","3.8","1.5","0.3","setosa"]],
        columns:[
            {"title":"Column1"},
            {"title":"Column2"},
            {"title":"Column3"},
            {"title":"Column4"},
            {"title":"Column5"}],
        dom: 'lfrtiBp',
        paging: <%=paging%>,
        info: <%=info%>,
        searching: <%=searching%>,
        buttons: <%=downloadAsCsv ? "['csv']" : "[]"%>
    };

	$('#<%=control.id%>').DataTable(opts);
    
</script>
<% } %>

<script type="text/javascript">
    $('#<%=control.id%>').data({
        'sortcolumnindex': <%=sortColumnIndex%>,
        'sortcolumnorder': '<%=sortColumnOrder%>',
        'paging': <%=paging%>,
        'info': <%=info%>,
        'searching': <%=searching%>,
        'downloadAsCsv': <%=downloadAsCsv%>
    });
</script>