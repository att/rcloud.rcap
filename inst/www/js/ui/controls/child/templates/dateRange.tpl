<% 
if(typeof control.controlProperties[0].value !== 'undefined' && control.controlProperties[0].value.length > 0)  { 
%>
<label for="<%=control.id%>">
    <%=control.controlProperties[0].value%>
</label>
<% } %>



<div class="daterange" data-variablename="<%=control.getControlPropertyValueOrDefault('variablename')%>" id="<%=control.id%>"
    data-hasinterval="<%=control.getControlPropertyValue('intervalType') !== ''%>" data-intervaltype="<%=control.getControlPropertyValue('intervalType')%>">

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

    <input type="date" id="<%=control.id%>-start" size="10"></input>

    <% if(control.getControlPropertyValue('intervalType') != '') { %>

        <span>plus</span>
        <input type="text" value="1" maxlength="4" size="4" id="<%=control.id%>-interval" />
        <span id="<%=control.id%>-interval-grammar"><%=control.singularInterval()%></span>

        <script type="text/javascript">
            $(function() {
                $('#<%=control.id%>-interval').bind("keyup paste", function(){
                    setTimeout(jQuery.proxy(function() {
                        this.val(this.val().replace(/[^0-9]/g, ''));

                        var intervalType = '<%=control.getControlPropertyValue('intervalType')%>';

                        if(this.val() === '1') {
                            $('#' + '<%=control.id%>-interval-grammar').text(intervalType.substring(0, intervalType.length - 1));
                        } else {
                            $('#' + '<%=control.id%>-interval-grammar').text(intervalType);
                        }

                    }, $(this)), 0);
                });
            });
        </script>

    <% } else { %>
         <span>to</span> <input type="date" id="<%=control.id%>-end" size="10"></input>
    <% } %>

</div>