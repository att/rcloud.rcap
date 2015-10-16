#' Process a control for OCAPs
#'
#' @description A generic function. The S3 class for a control should derive from
#' its \code{type} property from the JSON file. This function will then call
#' different methods for each type of control. Controls that do not require OCAPs
#' will not have a method and the deafult behaviour is to do nothing and return
#' an empty list. Controls that create OCAPs will generate the R function and
#' source to the global envirnoment before returning the name of the R function.
#'
#' @param rcapControl A list version of the control JSON object
#'
#' @return The function name of the OCAP or an empty list
#' @rdname processControl
#' 
#' @examples
#' \dontrun{
#' # Apply the class from the type if available
#' if (!is.null(rcapControl$type)) {
#'   attr(rcapControl, "class") <- rcapControl$type
#' }
#' 
#' processControl(rcapControl)
#' }
#' 
processControl <- function(rcapControl) {
  UseMethod("processControl", rcapControl)
}


# Default -----------------------------------------------------------------

processControl.default <- function(rcapControl) {
  return(list())
}


# rplot -------------------------------------------------------------------


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


# Interactive plot --------------------------------------------------------


#' @rdname processControl
#' @method processControl interactiveplot
processControl.interactiveplot <- function(rcapControl) {
  
  # The OCAP function name is the control id
  funName <- rcapControl$id
  
  # Pass the contents of the control to the template
  funText <- fillTemplate("interactiveplotTemplate.R",
                          list(control.id=rcapControl$id,
                               control.controlProperties.1=rcapControl$controlProperties[[1]]$value))
  
  sourceControlCode(funText, rcapControl$id)
  
  return(funName)
  
}





