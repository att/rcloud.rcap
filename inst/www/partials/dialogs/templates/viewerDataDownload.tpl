<% if(files.length) { %>
    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Size</th>
                <th>Last modified</th>
            </tr>
        </thead>
        <tbody>
            <% _.each(files, function(file){ %>
                <tr>
                    <td><a href="#"><%=file.filename%></a></td>
                    <td><%=file.filesize%></td>
                    <td><%=file.lastmodified%></td>
                </tr>
            <% }); %>
        </tbody>
    </table>
<% } else { %>
    <h2>No files available</h2>
<% } %>