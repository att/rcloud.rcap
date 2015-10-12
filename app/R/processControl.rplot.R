#' @rdname processControl
#' @method processControl rplot
#' 
processControl.rplot <- function(rcapControl) {
  
  # The OCAP function name is the control id
  funName <- rcapControl$id
  
  # Pass the contents of the control to the template
  funText <- fillTemplate("rplotTemplate.R",
                          list(control.id=rcapControl$id,
                               control.controlProperties.1=rcapControl$controlProperties[[1]]$value))
  
  sourceControlCode(funText, rcapControl$id)
  
  return(funName)
  
}