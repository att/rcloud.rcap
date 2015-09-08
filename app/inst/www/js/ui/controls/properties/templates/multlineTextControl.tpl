<div class="form-group" id="form-group-<%=property.id%>">
    <label for="<%=property.id%>"><%=property.label%></label>
    <textarea class="<%=property.className%>" rows="<%=property.rows%>" cols="<%=property.cols%>" id="<%=property.id%>" placeholder="<%=property.defaultValue%>" spellcheck="false" <%= property.isRequired ? ' required data-parsley-trigger="change" '  : '' %>><%=property.value%></textarea>
    <div class="description"><%=property.helpText%></div>
</div>