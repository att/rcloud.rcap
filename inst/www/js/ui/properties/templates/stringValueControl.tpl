<div class="row">
    <div class="col-md-4">
        <label for="<%=property.id%>"><%=property.label%></label>
    </div>
    <div class="col-md-8" id="property-options-<%=property.id%>">
        
        <!-- radio button for manual (default)/code: -->

        <label for="valueType-manual-<%=property.id%>">Manual</label>
        <input type="radio" name="valueType" id="valueType-manual-<%=property.id%>" value="manual" <%= property.valueType === 'manual' ? ' checked="checked"' : ''%>>

        <label for="valueType-code-<%=property.id%>">R Function</label>
        <input type="radio" name="valueType" id="valueType-code-<%=property.id%>" value="code" <%= property.valueType === 'code' ? ' checked="checked"' : ''%>>

        <!-- text input/autocomplete -->
        <div class="j-valueType" data-group="block-manual" id="group-valueType-manual-<%=property.id%>" <%= property.valueType !== 'manual' ? ' style="display:none" '  : '' %>>
            <input <%= property.valueType !== 'manual' ? ' disabled="disabled" '  : '' %> class="<%=property.className%>" type="text" style="width:100%" id="input-valueType-manual-<%=property.id%>" spellcheck="false" <%= property.isRequired && property.valueType === 'manual' ? ' required '  : '' %> <%= property.valueType === 'manual' && property.value ? ' value="' + property.value + '"' : ''%>></input>
            <div class="description"><%=property.helpText%></div>
        </div>

        <div class="j-valueType" data-group="block-code" id="group-valueType-code-<%=property.id%>" <%= property.valueType !== 'code' ? ' style="display:none" '  : '' %>>
            <input <%= property.valueType !== 'code' ? ' disabled="disabled" '  : '' %> class="<%=property.className%>" style="width:100%" id="input-valueType-code-<%=property.id%>" spellcheck="false" <%= property.isRequired && property.valueType === 'code' ? ' required' : '' %> <%= property.valueType === 'code' && property.value ? ' value="' + property.value  + '"' : ''%> />
            <div class="description"><%=property.codeHelpText%></div>
        </div>

        <script type="text/javascript">

            $('#property-options-<%=property.id%> :radio').click(function() {
                // disable the inputs:
                $('.j-valueType :text').prop('disabled', true).prop('required', false);
                // hide groups:
                $('.j-valueType').hide();

                // show the appropriate group:
                $('#group-' + $(this).attr('id')).show();
                // enable the input
                $('#input-' + $(this).attr('id')).prop('disabled', false).prop('required', true);    
            });

        // utilise the service:
        $('input-valueType-code-<%=property.id%>').autocomplete({
            source: function(request, response) {
                response(window.RCAP['<%=property.serviceName%>']());  
            }
        });

        </script>
        
    </div>
</div>