#' Fill in a function template
#'
#' @description The template is an R function with variables between tags with a
#' <%=VARIABLENAME%> format. On calling this function all the variables are
#' replaced with the supplied values and the function returned as a vector of
#' lines.
#'
#' @param templateName The file name (without directory) of the template. This
#' should be stored in \code{inst/Rtemplates}.
#' @param funParams A named list. The item name is the variable name in the 
#' template. The item value is what it should be replaced with.
#'
#' @return Character vector with the filled in template, each line with its own
#' entry in the vector.
#'
#' @export
#' @examples
#' funText <- fillTemplate("rplotTemplate.R",
#'   list(
#'     control.id = "rcapid123",
#'     control.controlProperties.1 = "hist(rnorm(1000))"
#'   )
#' )
#' cat(paste(funText, collapse="\n"))

fillTemplate <- function(templateName=NULL, funParams) {
  
  templateFile <- system.file(package="rcloud.rcap",
                              file=paste0("Rtemplates/", templateName))
  
  # Don't error, just inform that it wasn't found
  if(templateFile=="") {
    errorMsg <- paste("fillTemplate.R:: Template file,",
                      templateName, "not found")
    warning(errorMsg)
    if(!is.null(funParams$control.id)) {
      return(fillTemplate("errorTemplate.R", list(control.id=funParams$control.id,
                                                  errorMsg=errorMsg)))
    } else {
      return("ERROR")
    }
  }
  
  # Load the template
  funText <- readLines(templateFile)
  
  for(i in seq_along(funParams)) {
    funText <- gsub(paste0("<%=", names(funParams)[i], "%>"),
                    funParams[[i]], funText)
  }
  
  # Check that no variables are left over.
  leftOvers <- grepl( "<%=(.*?)%>", funText)
  if (sum(leftOvers) > 0) {
    # Match the variables are add to the error message
    unMatched <- gsub(".*<%=(.*?)%>.*", "\\1", funText[leftOvers])
    errorMsg <- paste(c("fillTemplate.R:: Some template variables have not been matched:",
                        unMatched), collapse=", ")
    
    warning(errorMsg)
    
    if(!is.null(funParams$control.id)) {
      return(fillTemplate("errorTemplate.R", list(control.id=funParams$control.id,
                                                  errorMsg=errorMsg)))
    } else {
      return("ERROR")
    }
    
  }
  
  return(funText)
}
