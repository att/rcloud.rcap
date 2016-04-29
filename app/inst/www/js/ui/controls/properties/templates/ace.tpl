<%if(property.isHorizontal) { %>

    <div class="row">
        <div class="col-md-4">
            <label for="<%=property.id%>"><%=property.label%></label>
        </div>
        <div class="col-md-8">
            <!-- editor to go in here -->
            <div class="description"><%=property.helpText%></div>
        </div>
    </div>

<% } else { %>

    <div class="form-group" id="form-group-<%=property.id%>">
        <label for="<%=property.id%>"><%=property.label%></label>

        <!-- editor to go in here -->

        <div class="description"><%=property.helpText%></div>

    </div>

<% } %>