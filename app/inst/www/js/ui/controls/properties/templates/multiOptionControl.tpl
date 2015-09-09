<div class="form-group" id="form-group-<%=property.id%>">
    <label for="<%=property.id%>"><%=property.label%></label>


    <br />

    <!-- radio button for manual (default)/code: -->

    <label for="optionType-manual-<%=property.id%>">Manual</label>
  	<input type="radio" name="optionType" id="optionType-manual-<%=property.id%>" value="manual" <%= property.optionType === 'manual' ? ' checked="checked"' : ''%>>

  	<label for="optionType-code-<%=property.id%>">Code</label>
  	<input type="radio" name="optionType" id="optionType-code-<%=property.id%>" value="code" <%= property.optionType === 'code' ? ' checked="checked"' : ''%>>


  	<!-- text areas -->

	<div class="j-optiontype" id="group-optionType-manual-<%=property.id%>" <%= property.optionType !== 'manual' ? ' style="display:none" '  : '' %>>
	    <textarea class="<%=property.className%>" rows="10" cols="20" id="ta-manual-<%=property.id%>" spellcheck="false" <%= property.isRequired ? ' data-parsley-required data-parsley-trigger="change" '  : '' %>><%if( property.optionType == 'manual') {%><%=property.translateValueToText()%><% } else { %><% } %></textarea>
	    <div class="description"><%=property.helpText%></div>
    </div>

    <div class="j-optiontype" id="group-optionType-code-<%=property.id%>" <%= property.optionType !== 'code' ? ' style="display:none" '  : '' %>>
	    <textarea class="<%=property.className%>" rows="10" cols="20" id="ta-code-<%=property.id%>" spellcheck="false" <%= property.isRequired ? ' data-parsley-required data-parsley-group="block-code" data-parsley-trigger="change" '  : '' %>><%if( property.optionType == 'code') {%><%=property.value%><% } else { %><% } %></textarea>
	    <div class="description"><%=property.codeHelpText%></div>
    </div>


    <script type="text/javascript">

    $(function() {


    	$('#form-group-<%=property.id%> :radio').click(function() {
  			$('#form-group-<%=property.id%> .j-optiontype').hide();
  			$('#group-' + $(this).attr('id')).show();
    	});

    });



    </script>
</div>