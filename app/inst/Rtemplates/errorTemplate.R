<%=control.id%> <- function(jsArgs=list()) {
  
  # Output the error message to the right div
  rcloud.web::rcw.set("#<%=control.id%>", "<%=errorMsg%>")
  
}
