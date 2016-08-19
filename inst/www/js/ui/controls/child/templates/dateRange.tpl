<% 
if(typeof control.controlProperties[0].value !== 'undefined' && control.controlProperties[0].value.length > 0)  { 
%>
<label for="<%=control.id%>">
    <%=control.controlProperties[0].value%>
</label>
<% } %>



<div class="daterange" data-variablename="<%=control.getControlPropertyValueOrDefault('variablename')%>" id="<%=control.id%>"
    data-hasinterval="<%=control.getControlPropertyValue('intervalType') !== ''%>">

    <!-- 
    <% switch(control.getControlPropertyValue('intervalType')) { case 'days': %>
        <p>days </p>
    <% break; case 'weeks': %>
        <p>weeks</p>
    <% break; case 'months': %>
        <p>months</p>
    <% break; case 'years': %>
        <p>years</p>
    <% break; } %> -->

    <input type="date" id="<%=control.id%>-start"></input>

    <% if(control.getControlPropertyValue('intervalType') != '') { %>

        <span>plus</span>
        <input type="text" value="1" maxlength="4" size="4" id="<%=control.id%>-interval" />
        <span><%=control.getControlPropertyValue('intervalType')%></span>

        <script type="text/javascript">
            $(function() {
                $('#<%=control.id%>-interval').bind("keyup paste", function(){
                    setTimeout(jQuery.proxy(function() {
                        this.val(this.val().replace(/[^0-9]/g, ''));
                    }, $(this)), 0);
                });
            });
        </script>
    <% } else { %>
         <span>to</span> <input type="date" id="<%=control.id%>-end"></input>
    <% } %>

</div>