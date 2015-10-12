<%=control.id%> <- function(jsArgs=list()) {
  
  # Output the error message to the right div
  errorMsg <- paste0("<pre class=\"rcaperror\">", "<%=errorMsg%>", "</pre>")
  rcloud.web::rcw.set("#<%=control.id%>", errorMsg)
  
}
