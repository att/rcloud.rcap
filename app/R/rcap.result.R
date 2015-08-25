
rcap.result <- function(rcapConfigFileName="rcap_designer.json") {
  
  # Retrieve the designer config from the notebook
  rcapJson <- rcloud.get.asset(name=rcapConfigFileName)
  
  # Convert the JSON into a list
  rcapConfig <- rjson::fromJSON(rcapJson)
  
  # Start building rcw call
  rcwResultList <- list(run=rcap.run, body="", rcapJson=rcapJson)
  
  # Parse for functions
  for(rcapControl in rcapConfig) {
    if (rcapControl$type == "rplot") {
      
      funArgs <- ""
      
      funName <- rcapControl$id
      funText <- paste0(funName, " <- function(", funArgs ,") {")
      
      funcText <- c(funText, "  wp1 <- WebPlot(width=500,height=500)")
      
      funcText <- c(funText, rcapControl$controlProperties$code)
      
      funcText <- c(funText, paste0("  rcw.set(\"#",rcapControl$id,"\", wp1)}"))
      
      # Make a temporary file
      sourceFile <- tempfile(fileext=".R")
      
      # Write our code to it
      writeLines(funcText, sourceFile)
      
      # source has a nice wrapper around eval(parse())
      source(sourceFile)
      
      # Make sure it's gone
      unlink(sourceFile)
      
      # Attach the function to the rcw call list
      rcwResultList[[funName]] <- eval(parse(text=funName))
    }
  }
  
  # Wrap plot and data functions and add to rcw call
  
  # Call rcw.result
  
  do.call(rcw.result, rcwResultList)
  
}