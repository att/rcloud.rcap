
sourceControlCode <- function(funText, controlId) {
  
  # Make a temporary file
  sourceFile <- tempfile(fileext=".R")
  
  # Write our code to it
  writeLines(funText, sourceFile)
  
  # source has a nice wrapper around eval(parse())
  error <- try(source(sourceFile), silent=TRUE)
  
  if(class(error)=="try-error") {
    # Create an error output
    if(!is.null(controlId)) {
      
      # Make it look codey
      errorMsg <- as.character(error)
      
      # Populate the error template
      funText <- fillTemplate("errorTemplate.R", list(control.id=controlId,
                                                      errorMsg=errorMsg))
      # recursive call, don't use controlId to stop it going around and around
      sourceControlCode(funText)
      
    }
  }
  
  # Make sure it's gone
  unlink(sourceFile)
  
}
